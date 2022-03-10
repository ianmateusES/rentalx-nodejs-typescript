FROM node:15-alpine

WORKDIR /usr/app

COPY package.json ./

RUN yarn

COPY . .

EXPOSE 3333

ENTRYPOINT [ "yarn", "build" ]

CMD [ "yarn", "prod" ]
