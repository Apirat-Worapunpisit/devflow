from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from app.database import get_db
from app.services import decode_access_token
from app.models import User

security = HTTPBearer()

# ทุก endpoint ที่ต้องการ login
# จะเรียก get_current_user อัตโนมัติ

# Client ส่ง JWT token มาใน Header
#     → decode token
#     → หา user จาก DB
#     → return user object

# ถ้าไม่มี token หรือ token หมดอายุ → 401 Unauthorized

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    token = credentials.credentials
    payload = decode_access_token(token)

    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = db.query(User).filter(User.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
        )

    return user