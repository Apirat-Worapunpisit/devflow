from fastapi import FastAPI #framework หลัก
from fastapi.middleware.cors import CORSMiddleware #ตัวกลางจัดการสิทธิ์การเข้าถึง
from app.config import settings #config ที่เขียนไว้ใน config.py
from app.api import auth, projects, tasks

#ทดสอบว่ารันได้:uvicorn app.main:app --reload
# http://localhost:8000/health
# http://localhost:8000/docs   ← Swagger UI ดู API ได้เลย

app = FastAPI(
    title=settings.APP_NAME, #ชื่อ ไปโชว์ใน Swagger docs (setting)
    debug=settings.DEBUG, #debug ละเอียดขึ้น (setting)
)

# CORS — อนุญาตให้ Nuxt frontend เรียก API ได้ ปัญหาคือ browser จะบล็อก request ที่มาจาก domain อื่นโดย default ดังนั้น
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://devflow-xxx.vercel.app",  # ← เปลี่ยนเป็น URL จริงของ Vercel
        "https://*.vercel.app",            # ← ครอบคลุมทุก Vercel URL
    ], # อนุญาตเฉพาะ localhost:3000 (Nuxt) เท่านั้น
    allow_credentials=True, # อนุญาตให้ส่ง cookie/token มาด้วยได้
    allow_methods=["*"], # อนุญาตทุก HTTP method (GET, POST, PUT, DELETE)
    allow_headers=["*"], # อนุญาตทุก header
)

# Routers
app.include_router(auth.router)
app.include_router(projects.router)
app.include_router(tasks.router)

# endpoint แรก — ใช้เช็คว่า server ยังทำงานอยู่ไหม ########
@app.get("/health")
def health_check():
    return {"status": "ok", "app": settings.APP_NAME}
#####################################################