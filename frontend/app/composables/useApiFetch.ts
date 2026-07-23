export async function apiFetch<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const apiUrl = useRuntimeConfig().public.apiUrl as string
  const url = path.startsWith('http') ? path : `${apiUrl}${path}`

  let response: Response

  try {
    response = await fetch(url, options)
  } catch {
    const errorStore = useErrorStore()
    const message = 'ไม่สามารถเชื่อมต่อ server ได้'
    errorStore.show(message)
    throw new Error(message)
  }

  if (!response.ok) {
    let message = `เกิดข้อผิดพลาด (${response.status})`
    try {
      const data = await response.json()
      if (typeof data?.detail === 'string') message = data.detail
    } catch {
      // response ไม่มี body หรือไม่ใช่ JSON
    }

    const errorStore = useErrorStore()
    errorStore.show(message)
    throw new Error(message)
  }

  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}
