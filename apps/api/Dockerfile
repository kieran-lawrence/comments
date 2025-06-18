FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
RUN npm install --include=dev
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]