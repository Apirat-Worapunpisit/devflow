FROM python:3.13-slim

WORKDIR /app

# ลง dependencies ก่อน copy code
# เพื่อให้ Docker cache layer นี้ได้
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# copy code ทั้งหมด
COPY . .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]