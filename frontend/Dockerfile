FROM node:20-alpine

WORKDIR /apps

COPY package*.json ./

RUN rm -rf node_modules && npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "start"]