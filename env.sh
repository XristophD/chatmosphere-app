#!/bin/bash

rm -rf ./env-config.js
# Substitute ENV variables in serverConfig file
envsubst < ./env-config-template.js > ./env-config.js