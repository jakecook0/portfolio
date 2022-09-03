FROM nginx:alpine

WORKDIR /portfolio

COPY . .

COPY ./nginx.conf /etc/nginx/nginx.conf