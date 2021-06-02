#!/usr/bin/env sh

main="$1"
n="$2"
L="$3"
D="$4"
I="$5"

logfile="${main}-n=${n}-L=${L}-D=${D}-I=${I}.log"

node --prof --logfile="$logfile" "$@"
