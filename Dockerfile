FROM node:latest

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY . /usr/src/app

RUN $HOME/.yarn/bin/yarn install --pure-lockfile
RUN npm run build

EXPOSE 8730
CMD ["npm", "start"]
