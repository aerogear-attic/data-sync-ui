import { DataSourceType } from "../../graphql/types/DataSourceType";

const defaultTemplates = {
    requestMappingTemplates: { Custom: "" },
    responseMappingTemplates: { Custom: "" }
};

const InMemoryQuery = `
{
  "operation": "find", "query": {
    "_type":"<type>", "<id>": "{{context.parent.id}}"
  }
}
`;

const InMemoryResponse = `
{{ toJSON (convertNeDBIds context.result) }}
`;

const PostgresQuery = `
SELECT * FROM <table> WHERE <id>='{{context.parent.id}}'
`;

const PostgresResponse = `
{{ toJSON context.result }}
`;

export const Templates = {
    [DataSourceType.InMemory]: {
        requestMappingTemplates: {
            ...defaultTemplates.requestMappingTemplates,
            "In Memory Query": InMemoryQuery
        },
        responseMappingTemplates: {
            ...defaultTemplates.responseMappingTemplates,
            "In Memory Response": InMemoryResponse
        }
    },
    [DataSourceType.Postgres]: {
        requestMappingTemplates: {
            ...defaultTemplates.requestMappingTemplates,
            "Postgres Query": PostgresQuery
        },
        responseMappingTemplates: {
            ...defaultTemplates.responseMappingTemplates,
            "Postgres Response": PostgresResponse
        }
    }
};

const getTemplatesForDataSource = (ds = {}) => Templates[ds.type] || defaultTemplates;

export { getTemplatesForDataSource };
