#!/bin/sh
set -e
remote_entrance=$1

echo "init remote server..."
echo "The remote_entrance is $1"

echo "kanbanApp.remote_entrance =$1" >>kanban/foundation/remoteServer.js

echo "done."
