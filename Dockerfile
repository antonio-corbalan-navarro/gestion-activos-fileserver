FROM node:20.11

WORKDIR /

VOLUME /src/uploads

COPY . .

RUN npm install

EXPOSE 3002

CMD [ "npm", "start" ]