#!/usr/bin/env sh

main="$1"
n="$2"
L="$3"
D="$4"
I="$5"

TIMESTAMP="$(date '+%Y-%m-%dT%H:%M:%S')"

logfile="${main}-n=${n}-L=${L}-D=${D}-I=${I}-${TIMESTAMP}-analyze-v8.log"

node --prof --log-all --logfile="$logfile" "$@"
