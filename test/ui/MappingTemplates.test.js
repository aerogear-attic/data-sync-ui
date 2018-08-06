import { getTemplatesForDataSource } from "../../ui/components/resolvers/MappingTemplates";
import { DataSourceType } from "../../ui/graphql/types/DataSourceType";

describe("#getTemplatesForDataSource", () => {
    it("should return all templates for an In Memory datasource", () => {
        const templates = getTemplatesForDataSource(
            { type: DataSourceType.InMemory }
        );

        expect(templates).toMatchObject({
            requestMappingTemplates: {
                Custom: "",
                "In Memory Query": expect.any(String)
            },
            responseMappingTemplates: {
                Custom: "",
                "In Memory Response": expect.any(String)
            }
        });
    });

    it("should return all templates for a Postgres datasource", () => {
        const templates = getTemplatesForDataSource(
            { type: DataSourceType.Postgres }
        );

        expect(templates).toMatchObject({
            requestMappingTemplates: {
                Custom: "",
                "Postgres Query": expect.any(String)
            },
            responseMappingTemplates: {
                Custom: "",
                "Postgres Response": expect.any(String)
            }
        });
    });

    it("should return Custom if no datasource is given", () => {
        const templates = getTemplatesForDataSource();

        expect(templates).toEqual({
            requestMappingTemplates: { Custom: "" },
            responseMappingTemplates: { Custom: "" }
        });
    });
});
