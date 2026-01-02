#!/bin/bash
MESSAGE="$1"
if [ -z "$MESSAGE" ]; then
    echo "Usage: $0 <message>"
    exit 1
fi
git add .
git commit -m "$MESSAGE"
git push
./build-and-push.sh zapgawd/zaphods-fix latest