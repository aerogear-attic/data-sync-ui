const queries = {
    CREATE_DATASOURCE_QUERY: ` 
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
    `
}
export { queries }