#!/usr/bin/env bash

artifact=$1
server_host=$2
server_dir=$3

echo "-> upload artifact to remote server"
scp  -rp  $artifact $server_host:$server_dir

echo "-> everything is done."