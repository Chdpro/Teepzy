# Create image based on the official Node 6 image from the dockerhub
FROM node:20

#install Redis

RUN wget http://download.redis.io/redis-stable.tar.gz && \
    tar xvzf redis-stable.tar.gz && \
    cd redis-stable && \
    make && \
    mv src/redis-server /usr/bin/ && \
    cd .. && \
    rm -r redis-stable && \
    npm install -g concurrently  

EXPOSE 6379

# Create a directory where our app will be placed
RUN mkdir -p /usr/src/app
# Change directory so that our commands run inside this new directory
WORKDIR /usr/src/app
# Copy dependency definitions
COPY package.json /usr/src/app
# Install Pm2
RUN npm install pm2 -g
# Install dependecies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/src/app

# give permission on that folder
RUN chmod -R 777 /usr/src/app/uploads/*

#sudo chmod -R 755 /uploads/*

# Expose the port the app runs in
EXPOSE 5000

EXPOSE 6379

# Serve the app
CMD ["pm2-runtime", "server.js"]

CMD concurrently "/usr/bin/redis-server --bind '0.0.0.0'" "sleep 5s; node /usr/src/app/server.js" 

