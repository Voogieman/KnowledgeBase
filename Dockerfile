FROM node:14 as base
WORKDIR /usr/src/app
COPY package*.json ./
EXPOSE 3000

FROM base as dev
ENV NODE_ENV=development
WORKDIR /usr/src/app
RUN npm i -g nodemon && npm i -g @nestjs/cli
COPY . .

CMD ["nodemon", "src/main"]

FROM base as prod
ENV NODE_ENV=production
RUN npm install --only=production
COPY . .
RUN npm run build

CMD ["node", "dist/main.js"]
