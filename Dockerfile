FROM nginx:latest
LABEL maintainer="Michael Lawrenson"

RUN apt-get update && apt-get upgrade -y

COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./app /usr/share/nginx/html

# Only include these in a development build