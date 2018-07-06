const queries = {
    CREATE_DATA_SOURCE_QUERY: ` 
        mutation createDataSource {
          createDataSource(
            name: "TestDataSource"
            type: Postgres
            config: "config: test"
          ) {
            id
            name
            type
            config
          }
        }
    `,
    GET_DATA_SOURCES_QUERY: `
       query getDataSourcesQuery {
         dataSources {
            id
            name
            type
            config
          }
       }
    `,
    GET_ONE_DATA_SOURCE_QUERY: `
    query getSingleDataSource {
      getOneDataSource(id: 1) {
        id
        name
        type
        config
  }
}`,
    DELETE_DATA_SOURCE_QUERY: `
     mutation deleteDataSource {
      deleteDataSource(id: 1) {
        name
      }
    }
  `,
    UPDATE_DATA_SOURCE_QUERY: `
      mutation updateDataSource {
      updateDataSource(id: 1, name: "NEW NAME", type: Postgres, config: "newConfig:config") {
        id
        name
        type
        config
      }
    }
    `
};
export { queries }