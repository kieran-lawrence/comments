FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=development
COPY package*.json ./
COPY . .
RUN npm install --include=dev
RUN ls -l node_modules/.bin
RUN npx esbuild --version
RUN npm run build
EXPOSE 3000
CMD ["node", "dist/index.js"]