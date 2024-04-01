FROM node:20.11

VOLUME /src

WORKDIR /src



COPY . .

RUN npm install

EXPOSE 3002

CMD [ "npm", "start" ]