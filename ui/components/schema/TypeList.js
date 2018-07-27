import React, { Component } from "react";
import {
    ListViewItem, Grid, Row, Col
} from "patternfly-react";

import style from "./structureView.css";
import { formatType } from "../../helper/GraphQLFormatters";

class TypeList extends Component {

    renderAdditionalInfo({ fields }) {
        if (fields && fields.length) {
            return fields.length + (fields.length > 1 ? " fields" : " field");
        }
        return "n.a.";
    }

    renderFields(fields) {
        if (!fields) {
            // Some types won't have fields
            return <span>No fields</span>;
        }

        return fields.map(field => {
            const type = field.type.name || field.type.kind;
            return (
                <Row key={type + field.name} className={style["structure-item-row"]}>
                    <Col xs={6} md={6}>
                        {field.name}
                    </Col>
                    <Col xs={6} md={6}>
                        {formatType(field.type)}
                    </Col>
                </Row>
            );
        });
    }

    render() {
        const { type } = this.props;
        const subItems = this.renderFields(type.fields);

        return (
            <ListViewItem
                key={type.name}
                className="structure-list-item"
                leftContent={<div className={style["structure-heading"]}>{type.name}</div>}
                description={<span />}
                hideCloseIcon
                additionalInfo={this.renderAdditionalInfo(type)}
            >
                <Grid fluid>
                    <Row className={style["structure-field-row"]}>
                        <Col xs={6} md={6}>
                            Field
                        </Col>
                        <Col xs={6} md={6}>
                            Type
                        </Col>
                    </Row>
                    {subItems}
                    <div hidden="true">Resolver Dialog Here</div>
                </Grid>
            </ListViewItem>
        );
    }

}

export { TypeList };
