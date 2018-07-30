import React from "react";
import GetSchema from "../../graphql/GetSchema.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";
import { Query } from "react-apollo";
import { Spinner, ListView } from "patternfly-react";
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

const renderList = (schemaId, compiled) => {
    const { types, queryType, mutationType, subscriptionType } = compiled.data.__schema;
    const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);
    const grouped = groupTypes(relevantTypes, queryType, mutationType, subscriptionType);

    return (
        <React.Fragment>
            { renderQueries(schemaId, grouped.queries) }
        </React.Fragment>
    );
};

const renderQueryItem = (schemaId, query) => {
    const { name, fields } = query;

    return (<Query key={name} query={GetResolvers} variables={{ schemaId, type: name }}>
        {({loading, error, data}) => {
            if (loading) return <Spinner className="spinner" loading />;
            if (error) return error.message;

            const queryList = fields.map(field => {
                field.isQuery = true;
                return <ResolversListItem
                    key={name}
                    type={name}
                    kind="query"
                    item={field}
                    resolvers={data}
                />
            });

            return (
                <div className={style["structure-content"]}>
                    <div className={style["structure-header"]}>
                        <span>Queries</span>
                    </div>
                    <ListView>
                        { queryList }
                    </ListView>
                </div>
            );
        }}
    </Query>);
};

const renderQueries = (schemaId, queries) => {
    const queryItems = queries.map(query => {
        return renderQueryItem(schemaId, query);
    });

    return (
        <React.Fragment>
            { queryItems }
        </React.Fragment>
    );
};

const renderEmpty = () => {
    return <DefaultEmptyView text="No Resolvers Defined" />
};

const ResolversList = () => {
    return (
        <Query query={GetSchema} variables={{name: "default"}}>
            {({loading, error, data}) => {
                if (loading) return <Spinner className="spinner" loading />;
                if (error) return error.message;

                const { getSchema: { id, compiled } } = data;
                const schema = JSON.parse(compiled);
                if (!schema.data) return renderEmpty();
                return renderList(id, schema);
            }}
        </Query>
    );
};

export { ResolversList };
