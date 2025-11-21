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

CMD ["npm", "run", "dev"]
