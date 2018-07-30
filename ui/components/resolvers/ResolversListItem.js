import React from "react";
import {
    ListViewItem, Grid, Row, Col, Spinner
} from "patternfly-react";
import style from "./resolversList.css";

const renderArguments = (args, resolvers) => {
    console.log(args);
    console.log(resolvers);
    return null;
};

const getResolverForField = (data, field) => {
    const { resolvers } = data;
    return resolvers.find(item => item.field === field);
};

const renderAdditionalInfo = (resolvers, kind, field) => {
    const resolver = getResolverForField(resolvers, field);
    if (resolver) {
        return <span>resolver.DataSource.name</span>;
    }

    return <span>No Data Source</span>;
};

const ResolversListItem = ({ kind, type, item, resolvers }) => {
    const { name, args } = item;
    const argsText = `${args.length} Argument${args.length !== 1 ? "s" : ""}`;
    return (
        <ListViewItem
            key={name}
            className="structure-list-item resolvers-list"
            leftContent={<div className={style["structure-heading"]}>{name}</div>}
            description={<span>{argsText}</span>}
            hideCloseIcon
            additionalInfo={[renderAdditionalInfo(resolvers, kind, name)]}
        >
            { renderArguments(args, resolvers) }
        </ListViewItem>
    );
};

export { ResolversListItem };
