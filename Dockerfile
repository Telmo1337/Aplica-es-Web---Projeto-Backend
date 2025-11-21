FROM node:20-slim

RUN apt-get update -y && \
    apt-get install -y openssl default-mysql-client && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate

EXPOSE 5050

CMD ["bash", "-c", "echo 'Waiting for MySQL...' && until mysqladmin ping -h mysql --silent; do echo 'MySQL not ready...'; sleep 2; done; echo 'MySQL ready!'; echo 'Running Prisma migrations...'; npx prisma migrate deploy; echo 'Starting server...'; npm run dev"]
