FROM node:18-alpine

WORKDIR /app

RUN apk update
RUN apk add openvpn

COPY package.json .
COPY package-lock.json .

RUN npm install

EXPOSE 3000

# CMD ["npm", "run", "start"]
CMD ["npm", "run", "test"]