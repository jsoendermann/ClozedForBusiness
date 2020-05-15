FROM node:13.14.0-alpine3.10

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 8730
CMD ["npm", "start"]
