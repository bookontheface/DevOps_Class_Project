FROM node:20-alpine
WORKDIR /apps
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["sh", "-c", "npm run seed && npm run start"]
