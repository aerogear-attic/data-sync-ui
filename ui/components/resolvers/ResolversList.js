import React from "react";
import { Query } from "react-apollo";
import { Spinner, ListView } from "patternfly-react";
import GetSchema from "../../graphql/GetSchema.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";
import { wellKnownTypes } from "../../helper/GraphQLWellKnownTypes";
import { DefaultEmptyView } from "../common/DefaultEmptyView";
import { ResolversListItem } from "./ResolversListItem";
import style from "./resolversList.css";

const groupTypes = (types, query, mutation, subscription) => types.reduce((acc, type) => {
    switch (type.name) {
        case query.name:
            acc.queries.push(type);
            break;
        case mutation.name:
            acc.mutations.push(type);
            break;
        case subscription.name:
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

const renderCustomType = (schemaId, item, text, kind, onClick) => {
    const { name } = item;
    return (
        <Query key={name} query={GetResolvers} variables={{ schemaId, type: name }}>
            {({ loading, error, data }) => {
                if (loading) {
                    return <Spinner className="spinner" loading />;
                }
                if (error) {
                    return error.message;
                }

                return (
                    <ResolversListItem
                        key={name}
                        type={name}
                        kind={kind}
                        item={item}
                        resolvers={data}
                        onClick={onClick}
                    />
                );
            }}
        </Query>
    );
};

const renderCustom = (schemaId, items, text, kind, onClick) => {
    const list = items.map(item => renderCustomType(schemaId, item, text, kind, onClick));

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
            { renderCustom(schemaId, custom, "Custom Types", "custom", onClick) }
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
