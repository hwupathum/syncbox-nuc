FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./
# COPY auth-config.yaml ./config/config.yaml

RUN npm install

# Bundle app source
COPY . .

EXPOSE 1901

CMD [ "npm", "start" ] 
