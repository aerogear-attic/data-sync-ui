import React from "react";
import GetSchema from "../../graphql/GetSchema.graphql";
import { Query } from "react-apollo";
import { Spinner } from "patternfly-react";
import { wellKnownTypes } from "../../helper/GraphQLWellKnownTypes";

const groupTypes = (types, query, mutation, subscription) => types.reduce((acc, type) => {
    switch (type.name) {
        case query.name:
            type.isQuery = true;
            acc.queries.push(type);
            break;
        case mutation.name:
            type.isMutation = true;
            acc.mutations.push(type);
            break;
        case subscription.name:
            type.isSubscription = true;
            acc.subscriptions.push(type);
            break;
        default:
            type.isCustom = true;
            acc.custom.push(type);
            break;
    }
    return acc;
}, {
    queries: [],
    mutations: [],
    subscriptions: [],
    custom: []
});

const renderList = (compiled) => {
    const { types, queryType, mutationType, subscriptionType } = compiled.data.__schema;
    const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);
    const grouped = groupTypes(relevantTypes, queryType, mutationType, subscriptionType);
    return <div>done</div>;
};

const renderEmpty = () => {
    return <div>Empty</div>;
}

const ResolversList = () => {
    return (
        <Query query={GetSchema} variables={{name: "default"}}>
            {({loading, error, data}) => {
                if (loading) return <Spinner className="spinner" loading />;
                if (error) return error.message;

                const { getSchema: { compiled } } = data;
                const schema = JSON.parse(compiled);
                if (!schema.data) return renderEmpty();
                return renderList(schema);
            }}
        </Query>
    );
};

export { ResolversList };
