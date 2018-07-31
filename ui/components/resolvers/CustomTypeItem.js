import React from "react";
import { ResolversListItem } from "./ResolversListItem";
import { Query } from "react-apollo";
import GetResolvers from "../../graphql/GetResolvers.graphql";
import { Spinner, ListView } from "patternfly-react";
import style from "./resolversList.css";

const renderCustomType = ({schemaId, item, text, kind, onClick}) => {
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

const CustomTypeItem = (props) => {
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


export { CustomTypeItem }
