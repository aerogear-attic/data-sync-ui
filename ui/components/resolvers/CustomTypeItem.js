import React from "react";
import { Query } from "react-apollo";
import { Spinner, ListView } from "patternfly-react";
import { ResolversListItem } from "./ResolversListItem";

import styles from "./ResolversListItem.css";

import GetResolvers from "../../graphql/GetResolvers.graphql";

const renderCustomType = ({ schemaId, item, kind, onClick }) => {
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
                        schemaId={schemaId}
                        key={name}
                        type={name}
                        kind={kind}
                        item={item}
                        resolvers={data.resolvers}
                        onClick={onClick}
                    />
                );
            }}
        </Query>
    );
};

/**
 * A CustomTypeItem is used to render a user defined GraphQL type in the resolver tab's
 * structure view
 */
const CustomTypeItem = props => {
    const { items, text } = props;
    const { resolversContent, resolversHeader, resolversList } = styles;
    const list = items.map(item => renderCustomType({ ...props, item }));

    return (
        <div className={resolversContent}>
            <div className={resolversHeader}>{text}</div>
            <ListView className={resolversList}>
                { list }
            </ListView>
        </div>
    );
};

export { CustomTypeItem };
