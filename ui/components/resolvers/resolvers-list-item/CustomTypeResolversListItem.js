import React from "react";
import { Query } from "react-apollo";
import {
    Spinner,
    ListViewItem,
    Grid,
    Row,
    Col
} from "patternfly-react";
import { CustomTypeArgs } from "./CustomTypeArgs";

import GetResolvers from "../../../graphql/GetResolvers.graphql";

import {
    headingDescription,
    resolversHeading,
    resolverFieldRow
} from "../ResolversListItem.css";

const CustomTypeResolversListItem = ({ schemaId, type, item, onClick }) => {
    const { fields, name } = item;
    const fieldsText = (
        <span className={headingDescription}>
            <span style={{ fontWeight: "600" }}>{fields.length}</span>
            <span style={{ fontWeight: "300" }}>{fields.length !== 1 ? " Arguments" : " Argument"}</span>
        </span>
    );

    return (
        <Query key={name} query={GetResolvers} variables={{ schemaId, type: name }}>
            {({ loading, error, data }) => {
                if (loading) {
                    return <Spinner className="spinner" loading />;
                }
                if (error) {
                    return error.message;
                }

                return (
                    <ListViewItem
                        key={name}
                        className="structure-list-item resolvers-list"
                        leftContent={<span className={resolversHeading}>{name}</span>}
                        description={fieldsText}
                        hideCloseIcon
                    >
                        <Grid fluid>
                            <Row className={resolverFieldRow}>
                                <Col xs={5}>Name</Col>
                                <Col xs={3}>Type</Col>
                                <Col xs={4}>Resolver</Col>
                            </Row>
                            {
                                fields.map(field => {
                                    const resolver = data.resolvers.find(r => r.field === field.name);

                                    return (
                                        <CustomTypeArgs
                                            key={field.name}
                                            field={field}
                                            schemaId={schemaId}
                                            type={type}
                                            resolver={resolver}
                                            onClick={onClick}
                                        />
                                    );
                                })
                            }
                        </Grid>
                    </ListViewItem>
                );
            }}
        </Query>
    );
};

export { CustomTypeResolversListItem };
