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
    query getSingleDataSource($id: Int!) {
      getOneDataSource(id: $id) {
        id
        name
        type
        config
      }
    }`,
    DELETE_DATA_SOURCE_QUERY: `
     mutation deleteDataSource($id: Int!) {
      deleteDataSource(id: $id) {
        name
      }
    }`,
    UPDATE_DATA_SOURCE_QUERY: `
    mutation updateDataSource($id: Int!, $name: String!, $type: DataSourceType!, $config: String!) {
      updateDataSource(id: $id, name: $name, type: $type, config: $config) {
        name
      }
    }`,
    GET_SCHEMA: `
    query getSchema($name: String!) {
      getSchema(name: $name) {
        id          
      }
    }
    `,
    UPDATE_SCHEMA: `
    mutation updateSchema($id: Int!, $schema: String!) {
      updateSchema(id: $id, schema: $schema) {
        compiled
      }
    }
    `,
    UPSERT_RESOLVER: `
    mutation upsertResolver($id: Int, $schemaId: Int!, $dataSourceId: Int!, $type: String!, $field: String!, $requestMapping: String!, $responseMapping: String!) {
      upsertResolver(id: $id, schemaId: $schemaId, dataSourceId: $dataSourceId, type: $type, field: $field, requestMapping: $requestMapping, responseMapping: $responseMapping) {
        id
      }
    }    
    `
};
module.exports = { queries };
