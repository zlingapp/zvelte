#!/bin/env bash

SCRIPT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
docker run -it --rm --net host \
  -v $SCRIPT_DIR/../dist:/data \
  -v $SCRIPT_DIR/site.conf:/etc/nginx/conf.d/default.conf \
  -v $SCRIPT_DIR/certs:/certs \
  nginx