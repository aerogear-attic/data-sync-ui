import React from "react";
import { Query } from "react-apollo";
import { Spinner, ListView } from "patternfly-react";
import GetSchema from "../../graphql/GetSchema.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";
import { wellKnownTypes } from "../../graphql/types/GraphQLWellKnownTypes";
import { DefaultEmptyView } from "../common/DefaultEmptyView";
import { ResolversListItem } from "./ResolversListItem";
import style from "./resolversList.css";
import { CustomTypeItem } from "./CustomTypeItem";

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

const renderGeneric = (schemaId, items, text, kind, onClick) => {
    // If there are no instances of a type render nothing (not even an empty list)
    if (!items || !items.length) {
        return null;
    }

    const { name, fields } = items[0];
    return (
        <Query key={name} query={GetResolvers} variables={{ schemaId, type: name }}>
            {({ loading, error, data }) => {
                if (loading) {
                    return <Spinner className="spinner" loading />;
                }
                if (error) {
                    return error.message;
                }

                const list = fields.map(field => {
                    field.isQuery = true;
                    return (
                        <ResolversListItem
                            key={name + field.name}
                            type={name}
                            kind={kind}
                            item={field}
                            resolvers={data}
                            onClick={onClick}
                        />
                    );
                });

                return (
                    <div className={style["structure-content"]}>
                        <div className={style["structure-header"]}>
                            <span>{text}</span>
                        </div>
                        <ListView>
                            { list }
                        </ListView>
                    </div>
                );
            }}
        </Query>
    );
};

const renderList = (schemaId, compiled, onClick) => {
    const { types, queryType, mutationType, subscriptionType } = compiled.data.__schema;
    const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);
    const {
        queries,
        mutations,
        subscriptions,
        custom
    } = groupTypes(relevantTypes, queryType, mutationType, subscriptionType);

    return (
        <React.Fragment>
            { renderGeneric(schemaId, queries, "Queries", "query", onClick) }
            { renderGeneric(schemaId, mutations, "Mutations", "mutation", onClick) }
            { renderGeneric(schemaId, subscriptions, "Subscriptions", "subscription", onClick) }
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
