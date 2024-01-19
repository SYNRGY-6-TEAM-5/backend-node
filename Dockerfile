ARG NODE_VERSION=18.17.0
FROM node:${NODE_VERSION}-alpine as build-image

WORKDIR /usr/src/app

COPY package*.json ./
COPY tsconfig.json ./

COPY ./ ./

RUN npm ci
RUN npx tsc -p .

FROM node:${NODE_VERSION}-alpine
WORKDIR /usr/src/app
COPY package*.json ./
COPY --from=build-image ./usr/src/app/dist ./dist
RUN npm ci --production
COPY . .
EXPOSE 8060

CMD ["npm", "run", "start"]
