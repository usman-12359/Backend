FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /pm

COPY package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
RUN mkdir -p logs && touch logs/access.log
RUN chmod -R 777 logs

COPY .env ./

EXPOSE 4001

CMD ["npm", "run", "start:staging"]