FROM node:20-alpine
WORKDIR /apps
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173
CMD ["npm", "run", "start", "--", "--host", "0.0.0.0"]
