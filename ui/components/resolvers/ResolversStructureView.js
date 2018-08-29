import React from "react";
import { Query } from "react-apollo";
import { Spinner } from "patternfly-react";
import { DefaultEmptyView } from "../common/DefaultEmptyView";
import { CustomTypeResolversList } from "./CustomTypeResolversList";
import { GenericTypeResolversList } from "./GenericTypeResolversList";

import GetSchema from "../../graphql/GetSchema.graphql";
import { wellKnownTypes } from "../../graphql/types/GraphQLWellKnownTypes";

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

const ResolversStructureView = ({ onClick }) => (
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
                return <DefaultEmptyView text="No Resolvers Defined" />;
            }

            const { types, queryType, mutationType, subscriptionType } = schema.data.__schema;

            const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);
            const {
                queries,
                mutations,
                subscriptions,
                custom
            } = groupTypes(relevantTypes, queryType, mutationType, subscriptionType);

            return (
                <React.Fragment>
                    <GenericTypeResolversList
                        schemaId={id}
                        items={queries}
                        text="Queries"
                        kind="query"
                        onClick={onClick}
                    />

                    <GenericTypeResolversList
                        schemaId={id}
                        items={mutations}
                        text="Mutations"
                        kind="mutation"
                        onClick={onClick}
                    />

                    <GenericTypeResolversList
                        schemaId={id}
                        items={subscriptions}
                        text="Subscriptions"
                        kind="subscription"
                        onClick={onClick}
                    />

                    <CustomTypeResolversList
                        schemaId={id}
                        items={custom}
                        text="Custom Types"
                        kind="custom"
                        onClick={onClick}
                    />
                </React.Fragment>
            );
        }}
    </Query>
);

export { ResolversStructureView };
