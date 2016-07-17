FROM node
MAINTAINER Mike Chen 
RUN mkdir -p /usr/src/pay
WORKDIR /usr/src/pay
COPY . /usr/src/pay

RUN npm install --production

EXPOSE 3000

CMD ["node", "bin/www"]

