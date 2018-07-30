import React from "react";
import {
    ListViewItem, Grid, Row, Col, Spinner
} from "patternfly-react";
import style from "./resolversList.css";
import { formatType } from "../../helper/GraphQLFormatters";

const renderArguments = (args, resolvers) => {
    if (!args || !args.length) {
        return null;
    }

    const mapped = args.map(arg => {
        return (
            <Row key={arg.name}>
                <Col xs={6} md={6}>
                    {arg.name}
                </Col>
                <Col xs={6} md={6} style={{textAlign: "right"}}>
                    {formatType(arg.type)}
                </Col>
            </Row>
        );
    });

    return (
        <Grid fluid>
            {mapped}
        </Grid>
    );
};

const getResolverForField = (data, field) => {
    const { resolvers } = data;
    return resolvers.find(item => item.field === field);
};

const renderAdditionalInfo = (resolvers, kind, field, type, onEdit) => {
    if (kind === "subscription") {
        return <span key={field}></span>;
    }

    const resolver = getResolverForField(resolvers, field);
    if (resolver) {
        return (<span
            onClick={() => {onEdit(type, field, resolver)}}
            key={field}
        >{resolver.DataSource.name}</span>);
    }

    return <span
        key={field}
        onClick={() => {onEdit(type, field, resolver)}}
    >No Resolver</span>;
};

const ResolversListItem = ({ kind, type, item, resolvers, onEdit }) => {
    const { name, args } = item;
    const argsText = `${args.length} Argument${args.length !== 1 ? "s" : ""}`;
    return (
        <ListViewItem
            key={name}
            className="structure-list-item resolvers-list"
            leftContent={<span className={style["structure-heading"]}>{name}</span>}
            description={<span>{argsText}</span>}
            hideCloseIcon
            additionalInfo={[renderAdditionalInfo(resolvers, kind, name, type, onEdit)]}
        >
            { renderArguments(args, resolvers) }
        </ListViewItem>
    );
};

export { ResolversListItem };
