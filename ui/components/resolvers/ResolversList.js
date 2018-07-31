import React from "react";
import { Query } from "react-apollo";
import { Spinner } from "patternfly-react";
import GetSchema from "../../graphql/GetSchema.graphql";
import { wellKnownTypes } from "../../graphql/types/GraphQLWellKnownTypes";
import { DefaultEmptyView } from "../common/DefaultEmptyView";
import { CustomTypeItem } from "./CustomTypeItem";
import { GenericTypeItem } from "./GenericTypeItem";

const groupTypes = (types, query, mutation, subscription) => types.reduce((acc, type) => {
    // If those types are not defined it usually means that the schema does not have
    // them. We can safely ignore them.
    const queryTypeName = query ? query.name : "Query";
    const mutationTypeName = mutation ? mutation.name : "Mutation";
    const subscriptionTypeName = subscription ? subscription.name : "Subscription";

    switch (type.name) {
        case queryTypeName:
            acc.queries.push(type);
            break;
        case mutationTypeName:
            acc.mutations.push(type);
            break;
        case subscriptionTypeName:
            acc.subscriptions.push(type);
            break;
        default:
            // We are only interested in the OJBECT kind, other kinds like
            // enums can't have resolvers
            if (type.kind === "OBJECT") {
                acc.custom.push(type);
            }
            break;
    }
    return acc;
}, {
    queries: [],
    mutations: [],
    subscriptions: [],
    custom: []
});

const renderList = (schemaId, compiled, onClick) => {
    const { types, queryType, mutationType, subscriptionType } = compiled.data.__schema;

    console.log("=== schema");
    console.log(compiled.data.__schema);

    const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);
    const {
        queries,
        mutations,
        subscriptions,
        custom
    } = groupTypes(relevantTypes, queryType, mutationType, subscriptionType);

    return (
        <React.Fragment>
            <GenericTypeItem
                schemaId={schemaId}
                items={queries}
                text="Queries"
                kind="query"
                onClick={onClick}
            />

            <GenericTypeItem
                schemaId={schemaId}
                items={mutations}
                text="Mutations"
                kind="mutation"
                onClick={onClick}
            />

            <GenericTypeItem
                schemaId={schemaId}
                items={subscriptions}
                text="Subscriptions"
                kind="subscription"
                onClick={onClick}
            />

            <CustomTypeItem
                schemaId={schemaId}
                items={custom}
                text="Custom Types"
                kind="custom"
                onClick={onClick}
            />
        </React.Fragment>
    );
};

const renderEmpty = () => <DefaultEmptyView text="No Resolvers Defined" />;

const ResolversList = ({ onClick }) => (
    <Query query={GetSchema} variables={{ name: "default" }}>
        {({ loading, error, data }) => {
            if (loading) {
                return <Spinner className="spinner" loading />;
            }
            if (error) {
                return error.message;
            }

            const { getSchema: { id, compiled } } = data;
            const schema = JSON.parse(compiled);
            if (!schema.data) {
                return renderEmpty();
            }
            return renderList(id, schema, onClick);
        }}
    </Query>
);

export { ResolversList };
