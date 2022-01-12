#!/usr/bin/env sh

main="$1"
n="$2"
L="$3"
D="$4"
I="$5"

TIMESTAMP="$(date '+%Y-%m-%dT%H:%M:%S')"

logfile="${main}-n=${n}-L=${L}-D=${D}-I=${I}-${TIMESTAMP}-analyze-v8.log"

NODE_LOADER_CONFIG=../test/loader/config.js IMPORT_MAP_PATH=../_benchmark/import-maps/src/index.json node --experimental-loader=@node-loader/core --prof --log-all --logfile="$logfile" analyze.js "$@"
