# AeroGear Sync UI

The UI for the [AeroGear Data Sync Server](https://github.com/aerogear/data-sync-server). Based on [React](https://reactjs.org/) and [PatternFly](https://www.patternfly.org/).

## Prerequisites

1. There is a dependency on having a running postgres server. To run postgres in a docker container use the following command:
 
    `docker-compose up`
    
2. Add some data to the database to display in the UI (optional):

    `INSERT INTO "DataSources" ("id","name","type","config","createdAt","updatedAt")VALUES (DEFAULT,'nedb_notes','InMemory','{"options":{"timestampData":true}}','2018-07-02 15:44:45.467 +00:00','2018-07-02 15:44:45.467 +00:00') RETURNING *;
`

## Running

1. `npm install`

1. `npm run server`. This will build the UI and watch for changes.

1. `npm run build`. Builds the UI in production mode. Use this before pushing a new docker image.

## Docker

1. To build the image run `docker build -t aerogear/sync-ui:latest .`
1. To run the image use `docker run --rm --name sync-ui -p 8000:8000 -d aerogear/sync-ui:latest`
1. To stop the container use `docker stop sync-ui`
