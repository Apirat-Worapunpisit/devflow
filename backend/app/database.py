from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# get_db คือ dependency injection
# FastAPI จะสร้าง DB session ให้อัตโนมัติทุกครั้งที่มี request
# และปิด session หลัง request เสร็จเสมอ ไม่มี connection leak
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()