import React from "react";
import { Query } from "react-apollo";
import { Spinner, ListView } from "patternfly-react";
import { ResolversListItem } from "./ResolversListItem";
import GetResolvers from "../../graphql/GetResolvers.graphql";
import style from "./resolversList.css";

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
                        resolvers={data}
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
    const list = items.map(item => renderCustomType({ ...props, item }));

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

export { CustomTypeItem };
