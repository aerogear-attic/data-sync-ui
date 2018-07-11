const { introspectionQuery } = require("graphql/utilities");
const { graphql, buildSchema } = require("graphql");

exports.compileSchemaString = function (source) {
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
};

exports.formatGraphqlErrors = function (result) {
    return result.errors.map(error => {
        return error.message;
    }).join("\n");
};
