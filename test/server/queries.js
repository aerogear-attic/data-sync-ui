module.exports = {
    CREATE_DATA_SOURCE: ` 
      mutation createDataSource($name: String!, $type: DataSourceType!, $config: JSON!) {
        createDataSource(name: $name, type: $type, config: $config) {
          id
          name
          type
          config
          resolvers {
            id
            type
            field
            requestMapping
            responseMapping
          }
        }
      }
    `,
    GET_DATA_SOURCES: `
      query getDataSourcesQuery {
        dataSources {
          id
          name
          type
          config
          resolvers {
            id
            type
            field
            requestMapping
            responseMapping
          }
        }
      }
    `,
    GET_DATA_SOURCE: `
      query getSingleDataSource($id: Int!) {
        getOneDataSource(id: $id) {
          id
          name
          type
          config
          resolvers {
            id
            type
            field
            preHook
            postHook
            requestMapping
            responseMapping
          }
        }
      }
    `,
    DELETE_DATA_SOURCE: `
      mutation deleteDataSource($id: Int!) {
        deleteDataSource(id: $id) {
          name
        }
      }
    `,
    UPDATE_DATA_SOURCE: `
      mutation updateDataSource($id: Int!, $name: String!, $type: DataSourceType!, $config: JSON!) {
        updateDataSource(id: $id, name: $name, type: $type, config: $config) {
          name
        }
      }
    `,
    GET_SCHEMAS: `
      query listSchemas {
        schemas {
          id
          name
          schema
        }
      }
    `,
    GET_SCHEMA: `
      query getSchema($name: String!) {
        getSchema(name: $name) {
          id
          name
          schema
          compiled
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
    GET_SUBSCRIPTIONS: `
      query listSubscriptions($schemaId: Int!) {
        subscriptions(schemaId: $schemaId) {
          type
          field
          topic
          filter
        }
      }
    `,
    GET_RESOLVERS: `
      query listResolvers($schemaId: Int!, $type: String!) {
        resolvers(schemaId: $schemaId, type: $type) {
          id
          type
          field
          preHook
          postHook
          responseMapping
          requestMapping
          GraphQLSchemaId
          publish
          DataSource {
            id
            name
            type
          }
        }
      }
    `,
    UPSERT_RESOLVER: `
      mutation upsertResolver(
        $id: Int,
        $schemaId: Int!,
        $dataSourceId: Int!,
        $type: String!,
        $field: String!,
        $preHook: String,
        $postHook: String,
        $requestMapping: String!,
        $responseMapping: String,
        $publish: String
      ) {
        upsertResolver(
          id: $id,
          schemaId: $schemaId,
          dataSourceId: $dataSourceId,
          type: $type,
          field: $field,
          preHook: $preHook,
          postHook: $postHook,
          requestMapping: $requestMapping,
          responseMapping: $responseMapping
          publish: $publish
        ) {
          id
        }
      }
    `
};
