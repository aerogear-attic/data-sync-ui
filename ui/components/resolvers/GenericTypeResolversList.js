import React from "react";
import { Query } from "react-apollo";
import { Spinner, ListView } from "patternfly-react";
import { GenericTypeResolversListItem } from "./resolvers-list-item";

import styles from "./ResolversListItem.css";

import GetResolvers from "../../graphql/GetResolvers.graphql";

/**
 * A generic type ite is used to render Queries, Mutations and Subscriptions in
 * the resolver tab's structure view
 * @param schemaId ID of the current Schema
 * @param items The list of Queries, Mutations or Subscriptions from the compiled schema
 * @param text What to display in the overview
 * @param kind one of "mutation", "query" or "subscription"
 * @param onClick Handler invoked when the user wants to add a resolver for the Query or
 * Mutation
 */
const GenericTypeResolversList = ({ schemaId, items, text, kind, onClick }) => {
    // If there are no instances of a type render nothing (not even an empty list)
    if (!items || !items.length) {
        return null;
    }

    const { resolversContent, resolversHeader, resolversList } = styles;
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
                        <GenericTypeResolversListItem
                            schemaId={schemaId}
                            key={name + field.name}
                            type={name}
                            kind={kind}
                            item={field}
                            resolvers={data.resolvers}
                            onClick={onClick}
                        />
                    );
                });

                return (
                    <div className={resolversContent}>
                        <div className={resolversHeader}>
                            <span>{text}</span>
                        </div>
                        <ListView className={resolversList}>
                            { list }
                        </ListView>
                    </div>
                );
            }}
        </Query>
    );
};

export { GenericTypeResolversList };
