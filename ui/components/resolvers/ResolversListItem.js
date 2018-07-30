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

const renderAdditionalInfo = (resolvers, kind, field) => {
    if (kind === "subscription") {
        return <span></span>;
    }

    const resolver = getResolverForField(resolvers, field);
    if (resolver) {
        return <span key={field}>resolver.DataSource.name</span>;
    }

    return <span key={field}>No Resolver</span>;
};

const ResolversListItem = ({ kind, type, item, resolvers }) => {
    const { name, args } = item;
    const argsText = `${args.length} Argument${args.length !== 1 ? "s" : ""}`;
    return (
        <ListViewItem
            key={name}
            onClick={() => { console.log("click") }}
            className="structure-list-item resolvers-list"
            leftContent={<span className={style["structure-heading"]}>{name}</span>}
            description={<span>{argsText}</span>}
            hideCloseIcon
            additionalInfo={[renderAdditionalInfo(resolvers, kind, name)]}
        >
            { renderArguments(args, resolvers) }
        </ListViewItem>
    );
};

export { ResolversListItem };
