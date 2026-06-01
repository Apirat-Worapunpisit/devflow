FROM node:22-slim

WORKDIR /app

# ลง dependencies ก่อน copy code
COPY package*.json .
RUN npm install

# copy code ทั้งหมด
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]