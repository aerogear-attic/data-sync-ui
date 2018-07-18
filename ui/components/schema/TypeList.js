import React, { Component } from "react";
import { Query } from "react-apollo";
import {
    ListViewItem, Grid, Row, Col, Button
} from "patternfly-react";

import style from "./structureView.css";
import GetResolvers from "../../graphql/GetResolvers.graphql";

class TypeList extends Component {

    deleteResolver(resolver) {
        console.log(resolver);
    }

    editResolver(resolver) {
        console.log("selected resolver");
        console.log(resolver.responseMapping);
    }

    createResolver(fieldName) {
        console.log(fieldName);
    }

    renderLoading() {
        return <div>Loading</div>;
    }

    renderError(error) {
        return <div>{error.message}</div>;
    }

    renderAdditionalInfo(type) {
        const { fields } = type;
        if (fields.length === 0) {
            return "n.a.";
        }
        return type.fields.length + (type.fields.length > 1 ? " fields" : " field");
    }

    renderResolverForField(name, data) {
        const { resolvers } = data;
        const resolver = resolvers.find(item => item.field === name);
        if (resolver) {
            return (
                <div>
                    <Button
                        bsStyle="primary"
                        bsSize="small"
                        onClick={() => this.editResolver(resolver)}
                    >
                        Edit
                    </Button>
                    &nbsp;
                    <Button
                        bsStyle="danger"
                        bsSize="small"
                        onClick={() => this.deleteResolver(resolver)}
                    >
                        Delete
                    </Button>
                </div>
            );
        }

        return (
            <Button
                bsStyle="primary"
                bsSize="small"
                onClick={() => console.log("Clicked create resolver")}
            >
                Add Resolver
            </Button>
        );
    }

    renderFields(fields, data) {
        if (!fields) {
            // Some types won't have fields
            return <span>No fields</span>;
        }

        return fields.map(field => {
            const type = field.type.name || field.type.kind;
            return (
                <Row key={type + field.name} className={style["structure-item-row"]}>
                    <Col xs={6} md={4}>
                        {field.name}
                    </Col>
                    <Col xs={6} md={4}>
                        {type}
                    </Col>
                    <Col xs={6} md={4}>
                        {this.renderResolverForField(field.name, data)}
                    </Col>
                </Row>
            );
        });
    }

    renderList(data) {
        const { type } = this.props;
        const subItems = this.renderFields(type.fields, data);

        return (
            <ListViewItem
                key={type.name}
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
                        <Col xs={6} md={4}>
                            Field Name
                        </Col>
                        <Col xs={6} md={4}>
                            Field Type
                        </Col>
                        <Col xs={6} md={4}>
                            Resolver
                        </Col>
                    </Row>
                    {subItems}
                    <div hidden="true">Resolver Dialog Here</div>
                </Grid>
            </ListViewItem>
        );
    }

    render() {
        const { schemaId, type } = this.props;
        return (
            <Query
                query={GetResolvers}
                variables={{
                    schemaId,
                    type
                }}
            >
                {({ loading, error, data }) => {
                    if (loading) {
                        return this.renderLoading();
                    }
                    if (error) {
                        return this.renderError(error);
                    }
                    return this.renderList(data);
                }}
            </Query>
        );
    }

}

export { TypeList };
