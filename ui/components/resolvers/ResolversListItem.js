import React from "react";
import {
    ListViewItem, Grid, Row, Col
} from "patternfly-react";
import style from "./resolversList.css";
import { formatType } from "../../helper/GraphQLFormatters";

const fireEditEvent = (handler, type, field, resolver) => {
    if (handler) {
        handler({ type, field, resolver });
    }
};

const getResolverForField = (data, field) => {
    const { resolvers } = data;
    return resolvers.find(item => item.field === field);
};

const renderFields = (type, fields, resolvers, onClick) => {
    const mapped = fields.map(field => {
        const resolver = getResolverForField(resolvers, field.name);
        const resolverText = resolver ? resolver.DataSource.name : "No Resolver";

        return (
            <Row key={field.name}>
                <Col xs={6} md={4}>
                    {field.name}
                </Col>
                <Col xs={6} md={4} style={{ textAlign: "center" }}>
                    {formatType(field.type)}
                </Col>
                <Col xs={6} md={4} style={{ textAlign: "right", color: "#188bcc" }}>
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={() => {
                            fireEditEvent(onClick, type, field.name, resolver);
                        }}
                        onKeyDown={() => {
                            fireEditEvent(onClick, type, field.name, resolver);
                        }}
                    >{resolverText}
                    </span>
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

const renderArguments = args => {
    // Don't render anything (not even an empty grid) when there are no args
    if (!args.length) {
        return null;
    }

    const mapped = args.map(arg => (
        <Row key={arg.name}>
            <Col xs={6} md={6}>
                {arg.name}
            </Col>
            <Col xs={6} md={6} style={{ textAlign: "right" }}>
                {formatType(arg.type)}
            </Col>
        </Row>
    ));

    return (
        <Grid fluid>
            {mapped}
        </Grid>
    );
};

const renderAdditionalInfo = (resolvers, kind, field, type, onClick) => {
    // TODO:implement subscription resolvers
    // For the moment we just don't display anything here
    if (kind === "subscription") {
        return <span key={field} />;
    }

    const resolver = getResolverForField(resolvers, field);
    const resolverText = resolver ? resolver.DataSource.name : "No Resolver";

    return (
        <span
            role="button"
            tabIndex={0}
            onClick={() => {
                fireEditEvent(onClick, type, field, resolver);
            }}
            onKeyDown={() => {
                fireEditEvent(onClick, type, field, resolver);
            }}
            key={field}
        >{resolverText}
        </span>
    );
};

const renderGeneric = ({ kind, type, item, resolvers, onClick }) => {
    const { args, name } = item;
    const argsText = `${args.length} Argument${args.length !== 1 ? "s" : ""}`;

    return (
        <ListViewItem
            key={name}
            className="structure-list-item resolvers-list"
            leftContent={<span className={style["structure-heading"]}>{name}</span>}
            description={<span>{argsText}</span>}
            hideCloseIcon
            additionalInfo={[renderAdditionalInfo(resolvers, kind, name, type, onClick)]}
        >
            { renderArguments(args, resolvers) }
        </ListViewItem>
    );
};

const renderCustom = ({ type, item, resolvers, onClick }) => {
    const { fields, name } = item;
    const fieldsText = `${fields.length} Field${fields.length !== 1 ? "s" : ""}`;

    return (
        <ListViewItem
            key={name}
            className="structure-list-item resolvers-list"
            leftContent={<span className={style["structure-heading"]}>{name}</span>}
            description={<span>{fieldsText}</span>}
            hideCloseIcon
        >
            { renderFields(type, fields, resolvers, onClick) }
        </ListViewItem>
    );
};

const ResolversListItem = props => {
    switch (props.kind) {
        case "custom":
            // Renders custom types
            return renderCustom(props);
        default:
            // Renders Queries, Mutations and Subscriptions
            return renderGeneric(props);
    }
};

export { ResolversListItem };
