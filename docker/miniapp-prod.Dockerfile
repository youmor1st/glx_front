FROM node:18-alpine

WORKDIR /app
COPY package*.json ./

RUN npm ci

COPY . .
COPY .env .env

EXPOSE 8080

CMD ["npm", "run", "dev"]