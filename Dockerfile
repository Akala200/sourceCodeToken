# Dockerfile

# Tell docker what base image to use
FROM keymetrics/pm2:10-alpine

# We'll now use /app as our path to to store our app
RUN mkdir /app

# We'll now use /app as our path to run all subsequent commands
WORKDIR /app

# Copy package.json and package-lock.json over to the docker container and install packages using npm install
# We copy this here instead of on a later line in order to leverage Docker's caching.
COPY ./package*.json ./
RUN npm install && npm cache clean --force

# Copy all other contents from the host to the docker container
COPY . ./

# Expose the port we're serving our website on
EXPOSE 3000

CMD ["pm2-runtime", "index.js", "--name", "app"]