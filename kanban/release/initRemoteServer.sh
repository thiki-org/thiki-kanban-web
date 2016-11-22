#!/bin/sh
set -e
remote_entrance=$1

echo "init remote server..."

echo "kanbanApp.remote_entrance =$remote_entrance" >>kanban/release/deploy.sh

echo "done."
