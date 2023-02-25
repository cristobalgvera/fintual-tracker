FROM node:18 as dev
WORKDIR /app
COPY package*.json ./
RUN npm install -g @nestjs/cli
RUN npm install --silent
COPY . .
CMD [ "npm", "run", "start:debug" ]
