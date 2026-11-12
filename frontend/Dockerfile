FROM node:20-alpine

WORKDIR /apps

COPY package*.json ./

RUN npm ci


COPY . .

EXPOSE 5173

CMD ["npm", "run", "start"]