import httpx
from app.config import settings
from typing import Optional

# รับชื่อ feature เช่น "ระบบ login"
# ส่งไปให้ Claude แตก task ให้
# ได้กลับมาเป็น list of tasks พร้อม priority
async def breakdown_tasks(feature_description: str) -> Optional[list[dict]]:
    if not settings.ANTHROPIC_API_KEY:
        return None

    headers = {
        "x-api-key": settings.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    prompt = f"""
    You are a helpful assistant for developers.
    Break down the following feature into small, actionable tasks.
    Respond in JSON format only, no explanation needed.
    
    Feature: {feature_description}
    
    Response format:
    [
        {{
            "title": "task title",
            "description": "what needs to be done",
            "priority": "low|medium|high",
            "estimated_hours": 1
        }}
    ]
    """

    payload = {
        "model": "claude-sonnet-4-20250514",
        "max_tokens": 1000,
        "messages": [{"role": "user", "content": prompt}],
    }

    async with httpx.AsyncClient() as client:
        response = await client.post(
            "https://api.anthropic.com/v1/messages",
            headers=headers,
            json=payload,
        )
        data = response.json()

    try:
        import json
        text = data["content"][0]["text"]
        return json.loads(text)
    except Exception:
        return None