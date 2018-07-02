# AeroGear Sync UI

The UI for the [AeroGear Data Sync Server](https://github.com/aerogear/data-sync-server). Based on react and patternfly.

## Running

1. `npm install`

1. `npm run server`. This will build the UI and watch for changes.

1. `npm run build`. Builds the UI in production mode. Use this before pushing a new docker image.

## Docker

1. To build the image run `docker build -t aerogear/sync-ui:latest .`
1. To run the image use `docker run --rm --name sync-ui -p 8000:8000 -d aerogear/sync-ui:latest`
1. To stop the container use `docker stop sync-ui`
