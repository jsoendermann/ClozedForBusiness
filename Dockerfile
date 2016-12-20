FROM node:latest

RUN curl -o- -L https://yarnpkg.com/install.sh | bash

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY . /usr/src/app

EXPOSE 8730

RUN $HOME/.yarn/bin/yarn install --pure-lockfile

CMD ["npm", "start"]

# # Create app directory
# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app

# # Install app dependencies
# COPY package.json /usr/src/app/
# RUN npm install

# # Bundle app source
# COPY . /usr/src/app

# EXPOSE 8730
# CMD [ "npm", "start" ]