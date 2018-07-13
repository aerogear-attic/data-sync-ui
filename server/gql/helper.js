const { introspectionQuery } = require("graphql/utilities");
const { graphql, buildSchema } = require("graphql");

exports.compileSchemaString = (source)  => {
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

exports.formatGraphqlErrors = ({ errors }) => {
    return errors.map(error => error.message).join("\n");
};
