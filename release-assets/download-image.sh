#!/bin/bash
TAG=${1:-latest}
echo "Downloading image for tag: $TAG"
curl -LO https://github.com/qadraxdev/mp4-conversion-hub/releases/download/v$TAG/mp4-conversion-hub.tar
docker load -i mp4-conversion-hub.tar
