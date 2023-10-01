#!/bin/env bash
SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" &>/dev/null && pwd)

CONF_FILE=$SCRIPT_DIR/site.test.conf

# if --dev is passed, use the dev config
if [[ $1 == "--dev" ]]; then
  echo "nginx: hosting from vite's hmr server"
  CONF_FILE=$SCRIPT_DIR/site.dev.conf
else
  echo "nginx: hosting built app (try \`yarn dev\` for hmr)"
  echo "zvelte starting @ https://localhost"
fi

docker run --rm --net host \
  -v $SCRIPT_DIR/../dist:/data \
  -v $CONF_FILE:/etc/nginx/conf.d/default.conf \
  -v $SCRIPT_DIR/certs:/certs \
  nginx
