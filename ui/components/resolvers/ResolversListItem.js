import React from "react";
import {
    ListViewItem, Grid, Row, Col, Spinner
} from "patternfly-react";
import style from "./resolversList.css";
import { formatType } from "../../helper/GraphQLFormatters";

const renderFields = (type, fields, resolvers, onEdit) => {
    if (!fields || !fields.length) {
        return null;
    }

    const mapped = fields.map(field => {
        const resolver = getResolverForField(resolvers, field.name);
        const resolverText = resolver ? resolver.DataSource.name : "No Resolver";

        return (
            <Row key={field.name}>
                <Col xs={6} md={4}>
                    {field.name}
                </Col>
                <Col xs={6} md={4} style={{textAlign: "center"}}>
                    {formatType(field.type)}
                </Col>
                <Col xs={6} md={4} style={{textAlign: "right", color: "#188bcc"}}>
                    <span
                        onClick={() => {onEdit(type, field.name, resolver)}}
                    >{resolverText}</span>
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

const renderArguments = (args) => {
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

const renderGeneric = ({ kind, type, item, resolvers, onEdit }) => {
    const { args, name } = item;
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

const renderCustom = ({ kind, type, item, resolvers, onEdit }) => {
    const { fields, name } = item;
    const fieldsText = `${fields.length} Field${fields.length !== 1 ? "s" : ""}`;

    return (
        <ListViewItem
            key={name}
            className="structure-list-item resolvers-list"
            leftContent={<span className={style["structure-heading"]}>{name}</span>}
            description={<span>{fieldsText}</span>}
            hideCloseIcon
            additionalInfo={[]}
        >
            { renderFields(type, fields, resolvers, onEdit) }
        </ListViewItem>
    );
};

const ResolversListItem = (props) => {
    const { kind } = props;
    switch (kind) {
        case "custom":
            return renderCustom(props);
            break;
        default:
            return renderGeneric(props);
            break;
    }
};

export { ResolversListItem };
