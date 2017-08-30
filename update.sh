#!/bin/bash

rm *.zip
zip -r forecast.zip package.json index.js src node_modules

#wsk action create forecast2 --param-file parameters.json --kind nodejs:6 forecast.zip
bx wsk action update forecast2 --web true --param-file parameters.json --kind nodejs:6 forecast.zip
