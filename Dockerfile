FROM ubuntu
MAINTAINER Mike Chen 
RUN sudo apt install nodejs
RUN sudo apt install npm 
ADD . /src
RUN cd /src; npm install
EXPOSE 3000
CMD ["node", "/src/bin/www"]

