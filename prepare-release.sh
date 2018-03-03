#! /usr/bin/bash
git add .
git commit -m "Release Version: $1"
git push
git tag -a $1 -m "Release Version: $1"
git push --tags