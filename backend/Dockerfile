FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --omit=dev && npm install -g @nestjs/cli

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]
