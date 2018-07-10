import { introspectionQuery } from "graphql/utilities";
import { graphql, buildSchema } from "graphql";

export function compileSchemaString(source) {
    return new Promise((resolve, reject) => {
        let Schema;
        try {
            Schema = buildSchema(source);
            return graphql(Schema, introspectionQuery)
                .then(resolve)
                .catch(reject);
        } catch (err) {
            return reject(err);
        }
    });
}
