# sets the base of the docker image
FROM node:16.13.1-alpine
# create group and user name app
# RUN addgroup app && adduser -S -G app app
# set the user after creating app user
# USER app
#to set the work directory of the docker image
WORKDIR /app
# Copy the files from current project directory to work directory or path provided in the image directory
COPY package*.json .
# RUN commands will be executed inside your docker image during building of image
# RUN npm install -g npm@8.2.0
RUN npm install
COPY . .
# ENV command to setup environment variables for your docker image
ENV API_URL=http://api.myapp.com/
# EXPOSE command to expose the port to which docker container will listen to
EXPOSE 3000
# command instruction to execute once image is run
# shell form of CMD command -> docker executes this command inside a separate shell(on linux -> /bin/sh/)
# CMD npm start
# Exec form -> execute this command directly without having to spin up another shell
CMD ["npm","start"]
# ENTRYPOINT [ "npm", "start" ]