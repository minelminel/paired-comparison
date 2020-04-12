FROM nginx:latest
LABEL maintainer="Michael Lawrenson"

RUN apt-get update && apt-get upgrade -y
# Only include in development build
RUN apt-get install -y vim

# Include source
COPY ./conf/default.conf /etc/nginx/conf.d/default.conf
COPY ./conf/entrypoint.sh /
COPY ./app /usr/share/nginx/html

# CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && \
#     nginx -g 'daemon off;'
ENTRYPOINT [ "/bin/bash /entrypoint.sh" ]