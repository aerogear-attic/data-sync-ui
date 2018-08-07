import React from "react";
import { Query } from "react-apollo";
import { Spinner, ListView } from "patternfly-react";
import { ResolversListItem } from "./ResolversListItem";
import GetResolvers from "../../graphql/GetResolvers.graphql";
import style from "./resolversList.css";

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
const GenericTypeItem = ({ schemaId, items, text, kind, onClick }) => {
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
                            schemaId={schemaId}
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

export { GenericTypeItem };
