FROM centos/nodejs-8-centos7:latest

EXPOSE 8080

USER root

COPY server ./server
COPY public ./public
COPY package.json ./package.json

USER default

RUN scl enable rh-nodejs8 "npm install --production"

CMD ["npm", "start"]
