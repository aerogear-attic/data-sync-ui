# AeroGear Sync UI

[![circle-ci](https://img.shields.io/circleci/project/github/aerogear/data-sync-ui/master.svg)](https://circleci.com/gh/aerogear/data-sync-ui)
[![Docker Hub](https://img.shields.io/docker/automated/jrottenberg/ffmpeg.svg)](https://hub.docker.com/r/aerogear/data-sync-ui/)
[![Docker Stars](https://img.shields.io/docker/stars/aerogear/data-sync-ui.svg)](https://registry.hub.docker.com/v2/repositories/aerogear/data-sync-ui/stars/count/)
[![Docker pulls](https://img.shields.io/docker/pulls/aerogear/data-sync-ui.svg)](https://registry.hub.docker.com/v2/repositories/aerogear/data-sync-ui/)
[![License](https://img.shields.io/:license-Apache2-blue.svg)](http://www.apache.org/licenses/LICENSE-2.0)

The UI for the [AeroGear Data Sync Server](https://github.com/aerogear/data-sync-server). Based on [React](https://reactjs.org/) and [PatternFly](https://www.patternfly.org/).

|                          | Project Info                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| License:                 | Apache License, Version 2.0                                      |
| Build:                   | Docker                                                           |
| End User Documentation:  | https://docs.aerogear.org                                        |
| Community Documentation: | https://aerogear.org                                             |
| Issue tracker:           | https://issues.jboss.org/browse/AEROGEAR                         |
| Mailing lists:           | [aerogear-dev](https://groups.google.com/forum/#!forum/aerogear) |

## Prerequisites

* A running PostgreSQL server. To run postgres in a docker container use the following command

    ```shell
    docker-compose up
    ```

> Database credentials can be found in [docker-compose.yml](docker-compose.yml)

## Running

1. Install the dependencies
   
   ```shell
   npm install
   ```

1. Build the UI and watch for changes.

   ```shell
   npm run server
   ```

1. Builds the UI in __production__ mode. Use this before pushing a new docker image.

   ```shell
   npm run build
   ```
   
## Docker

1. Build the image 

   ```shell
   docker build -t aerogear/sync-ui:latest .
   ```
   
1. Run the image
   ```shell
   docker run --rm --name sync-ui -p 8000:8000 -d aerogear/sync-ui:latest
   ```
1. Stop the container

   ```shell
   docker stop sync-ui
   ```

# Configuration

UI server has some environment variables to be set. If they're not set, defaults for development will be used.

* `AUDIT_LOGGING`:   : If true, audit logs of resolver operations will be logged to stdout. Defaults to true.