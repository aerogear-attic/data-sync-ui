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

A running PostgreSQL server. To run postgres in a docker container use the following command

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
 
# Tests

The UI makes use of [Jest](https://jestjs.io/) as assertion library and [Enzyme](http://airbnb.io/enzyme/) as DOM rendering and manipulation utility.

## Running the test suite
To execute the whole test suite:
1. Make sure the app is stopped, otherwise server tests will fail.
1. Install development dependencies:
    ```shell
    npm install --development
    ```    
1. Run:
    ```shell
    npm run test
    ```

To execute a single test file:
1. Install Jest or run it from the project dependencies:
    ```shell
    node_modules/.bin/jest path/to/test.js
    ```
> You can also run a single test using [`it.only()`](https://jestjs.io/docs/en/api#testonlyname-fn-timeout).

## Adding new tests

Writing tests cases with Enzyme, Apollo and React might be tricky. Before adding any new ones, keep in mind:

* Test files must end with `.test.js` for Jest to find them.
* Components using GraphQL queries must be fully rendered and inside a `MockedProvided` component:
   ```javascript
    <MockedProvider mocks={[]} addTypename={false}>
        <DataSourcesList />
    </MockedProvider>
   ```
   Read more about testing with Apollo and React ah the [Apollo testing guide](https://www.apollographql.com/docs/guides/testing-react-components.html).
* When asserting using query result, you must define mocks for all involved ones. They have to be mocked in the exact way they are called and they are only valid for 1 call. Moreover, the process turns into async so this has to be handled properly to avoid false positives. This [Github issues answer](https://github.com/apollographql/react-apollo/issues/1711#issuecomment-369511476) describes briefly and concisely how to do it.
* GraphQL-indenpendant components may be better rendered with `shallow()` and `render()`, read more about them at [Enzyme docs](http://airbnb.io/enzyme/docs/api/).
* Enzyme wrappers are snapshots of the DOM. Whenever you expect something to change, don't forget calling `wrapper.update()`.
* Use [it.skip()](https://jestjs.io/docs/en/api#testname-fn-timeout) instead of commenting out blocks or adding TODOs.
> If using *VSCode*, give [Jest VSCode Extension](https://github.com/jest-community/vscode-jest) a try.
