#!/bin/sh
set -e
artifactDirectory=$1
deployTargetDirectory=$2

echo "clean deploy target directory ..."
rm -rf $2
echo "copy file to deploy target directory ..."
mv $1  $2
echo "done."
