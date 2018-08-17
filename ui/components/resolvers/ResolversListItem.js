import React from "react";
import {
    ListViewItem,
    Grid,
    Row,
    Col
} from "patternfly-react";

import styles, { resolversHeading } from "./ResolversListItem.css";

import { formatType } from "../../helper/GraphQLFormatters";

const renderAdditionalInfo = (resolvers, schemaId, kind, field, type, onClick) => {
    // TODO:implement subscription resolvers
    // For the moment we just don't display anything here
    if (kind === "subscription") {
        return <span key={field} />;
    }

    const resolver = resolvers.find(item => item.field === field);
    const resolverText = resolver ? resolver.DataSource.name : "no resolver set";

    return (
        <div className={resolver ? styles.headingResolverSet : styles.headingResolverUnset} key="Resolver">
            <span
                role="button"
                tabIndex={0}
                onClick={() => onClick({ schemaId, type, field, ...resolver })}
                onKeyDown={() => onClick({ schemaId, type, field, ...resolver })}
                key={field}
            >{resolverText}
            </span>
        </div>
    );
};

const renderGeneric = ({ kind, schemaId, type, item, resolvers, onClick }) => {
    const { args, name } = item;
    const argsText = (
        <span className={styles.headingDescription}>
            <span style={{ fontWeight: "600" }}>{args.length}</span>
            <span style={{ fontWeight: "300" }}>{args.length !== 1 ? " Arguments" : " Argument"}</span>
        </span>
    );

    return (
        <ListViewItem
            key={name}
            className="structure-list-item resolvers-list"
            leftContent={<span className={resolversHeading}>{name}</span>}
            description={argsText}
            hideCloseIcon
            additionalInfo={[renderAdditionalInfo(resolvers, schemaId, kind, name, type, onClick)]}
        >
            {
                args.length ? (
                    <Grid fluid>
                        <Row className={styles.resolverFieldRow}>
                            <Col xs={6}>Name</Col>
                            <Col xs={6}>Type</Col>
                        </Row>
                        {
                            args.map(arg => (
                                <Row key={arg.name} className={styles.resolverItemRow}>
                                    <Col xs={6} className={styles.itemName}>{arg.name}</Col>
                                    <Col xs={6} className={styles.itemType}>{formatType(arg.type)}</Col>
                                </Row>
                            ))
                        }
                    </Grid>
                ) : <span />
            }
        </ListViewItem>
    );
};

const renderCustomTypeArgs = (schemaId, type, fields, resolvers, onClick) => (
    fields.map(field => {
        const resolver = resolvers.find(item => item.field === field.name);
        const resolverText = resolver ? resolver.DataSource.name : "no resolver set";

        return (
            <Row key={field.name} className={styles.resolverItemRow}>
                <Col xs={5} className={styles.itemName}>{field.name}</Col>
                <Col xs={3} className={styles.itemType}>{formatType(field.type)}</Col>
                <Col xs={4} className={styles.itemResolver}>
                    <span
                        role="button"
                        tabIndex={0}
                        onClick={() => onClick({ schemaId, type, field: field.name, ...resolver })}
                        onKeyDown={() => onClick({ schemaId, type, field: field.name, ...resolver })}
                    >{resolverText}
                    </span>
                </Col>
            </Row>
        );
    })
);

const renderCustom = ({ schemaId, type, item, resolvers, onClick }) => {
    const { fields, name } = item;
    const fieldsText = (
        <span className={styles.headingDescription}>
            <span style={{ fontWeight: "600" }}>{fields.length}</span>
            <span style={{ fontWeight: "300" }}>{fields.length !== 1 ? " Arguments" : " Argument"}</span>
        </span>
    );

    return (
        <ListViewItem
            key={name}
            className="structure-list-item resolvers-list"
            leftContent={<span className={resolversHeading}>{name}</span>}
            description={fieldsText}
            hideCloseIcon
        >
            <Grid fluid>
                <Row className={styles.resolverFieldRow}>
                    <Col xs={5}>Name</Col>
                    <Col xs={3}>Type</Col>
                    <Col xs={4}>Resolver</Col>
                </Row>
                {renderCustomTypeArgs(schemaId, type, fields, resolvers, onClick)}
            </Grid>
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
