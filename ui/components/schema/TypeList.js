import React, { Component } from "react";
import {
    ListViewItem, Grid, Row, Col
} from "patternfly-react";

import style from "./structureView.css";
import { formatType } from "../common/GraphQLFormatters";

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

    renderList() {
        const { type } = this.props;
        const subItems = this.renderFields(type.fields);

        return (
            <ListViewItem
                key={type.name}
                className="structure-list-item"
                leftContent={<p className={style["structure-name"]}>{type.name}</p>}
                description={<span />}
                hideCloseIcon
                additionalInfo={[
                    <p key={type.name} className={style["structure-name"]}>
                        {this.renderAdditionalInfo(type)}
                    </p>]}
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

    render() {
        return this.renderList();
    }

}

export { TypeList };
