#!/bin/sh
set -e
remote_entrance=$1

echo "init remote server..."

echo "kanbanApp.remote_entrance =$remote_entrance" >>kanban/release/deploy.sh
mv src/main/resources/scripts/deploy.sh /data/thiki-kanban/sit
echo "done."
