import React from "react";
import {
    ListView,
    Grid,
    Row,
    Col
} from "patternfly-react";

import { formatType } from "../../helper/GraphQLFormatters";

import {
    structureHeading, structureFieldRow, structureListItem, structureItemRow
} from "./StructureViewListItem.css";

const StructureViewListItem = ({ type }) => {
    const renderAdditionalInfo = ({ fields }) => {
        if (fields && fields.length) {
            return fields.length + (fields.length > 1 ? " fields" : " field");
        }
        return "n.a.";
    };

    const renderFields = fields => {
        if (!fields) {
            return <span>No fields</span>;
        }

        return fields.map(field => {
            const fieldType = field.type.name || field.type.kind;
            return (
                <Row key={fieldType + field.name} className={structureItemRow}>
                    <Col xs={6} md={6}>{field.name}</Col>
                    <Col xs={6} md={6}>{formatType(field.type)}</Col>
                </Row>
            );
        });
    };

    const additionalInfo = [renderAdditionalInfo(type)];
    const subItems = renderFields(type.fields);

    return (
        <ListView.Item
            key={type.name}
            className={structureListItem}
            leftContent={(
                <span className={structureHeading}>{type.name}</span>
            )}
            hideCloseIcon
            additionalInfo={additionalInfo}
        >
            <Grid fluid>
                <Row className={structureFieldRow}>
                    <Col xs={6} md={6}>Field</Col>
                    <Col xs={6} md={6}>Type</Col>
                </Row>
                {subItems}
            </Grid>
        </ListView.Item>
    );
};

export { StructureViewListItem };
