import React, { Component } from "react";
import { Query } from "react-apollo";
import {
    ListViewItem, Grid, Row, Col, Button, Spinner
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

    createResolver() {
        console.log("called create resolver");
    }

    renderLoading() {
        return <Spinner className="spinner" loading />;
    }

    renderError(error) {
        return <div>{error.message}</div>;
    }

    renderAdditionalInfo({ fields }) {
        if (fields && fields.length) {
            return fields.length + (fields.length > 1 ? " fields" : " field");
        }
        return "n.a.";
    }

    renderResolverForField(name, data) {
        const { resolvers } = data;
        const resolver = resolvers.find(item => item.field === name);
        if (resolver) {
            return (
                <React.Fragment>
                    <Button
                        className={style["structure-item-edit-btn"]}
                        bsStyle="primary"
                        bsSize="small"
                        onClick={() => this.editResolver(resolver)}
                    >
                        Edit
                    </Button>
                    <Button
                        className={style["structure-item-delete-btn"]}
                        bsStyle="danger"
                        bsSize="small"
                        onClick={() => this.deleteResolver(resolver)}
                    >
                        Delete
                    </Button>
                </React.Fragment>
            );
        }

        return (
            <Button
                bsStyle="primary"
                bsSize="small"
                onClick={() => this.createResolver()}
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
