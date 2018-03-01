#! /usr/bin/bash
git add .
git commit -m "Trvia Release Version: $1"
git push
git tag -a $1 -m "Trvia Release Version: $1"
git push --tags