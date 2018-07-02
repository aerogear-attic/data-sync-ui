#!/bin/sh

RELEASE_TAG=$CIRCLE_TAG

docker build -t aerogear/data-sync-ui:$RELEASE_TAG .
