FROM node:20-alpine

WORKDIR /apps

COPY package*.json ./

RUN npm ci
RUN npm install -g vite

COPY . .

EXPOSE 5173

CMD ["npm", "run", "start"]