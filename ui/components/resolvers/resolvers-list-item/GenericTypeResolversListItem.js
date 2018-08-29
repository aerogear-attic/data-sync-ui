import React from "react";
import {
    ListViewItem,
    Grid,
    Row,
    Col
} from "patternfly-react";
import { AdditionalInfo } from "./AdditionalInfo";

import styles from "../ResolversListItem.css";

import { formatType } from "../../../helper/GraphQLFormatters";

const renderAdditionalInfo = (resolver, schemaId, kind, field, type, onClick) => {
    // TODO:implement subscription resolvers
    // For the moment we just don't display anything here
    if (kind === "subscription") {
        return null;
    }

    return (
        <AdditionalInfo
            resolver={resolver}
            onClick={onClick}
            schemaId={schemaId}
            type={type}
            field={field}
            key={field}
        />
    );
};

const GenericTypeResolversListItem = ({ kind, schemaId, type, item, resolvers, onClick }) => {
    const { args, name } = item;
    const argsText = (
        <span className={styles.headingDescription}>
            <span style={{ fontWeight: "600" }}>{args.length}</span>
            <span style={{ fontWeight: "300" }}>{args.length !== 1 ? " Arguments" : " Argument"}</span>
        </span>
    );

    const resolver = resolvers.find(r => r.field === name);

    return (
        <ListViewItem
            key={name}
            className="structure-list-item resolvers-list"
            leftContent={<span className={styles.resolversHeading}>{name}</span>}
            description={argsText}
            hideCloseIcon
            additionalInfo={[renderAdditionalInfo(resolver, schemaId, kind, name, type, onClick)]}
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

export { GenericTypeResolversListItem };
