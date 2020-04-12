#!/usr/bin/env bash
# If running on Heroku, set the correct $PORT, else use default
if [[ -z "$PORT" ]]; then
    echo "USING DEFAULT PORT: 80"
    PORT=80
else
    echo "USING PORT ENVVAR: $PORT"
fi
sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf
nginx -g 'daemon off;'