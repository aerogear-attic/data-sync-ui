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
import { ResolversCount } from "../../common";

import GetResolvers from "../../../graphql/GetResolvers.graphql";

import {
    headingDescription,
    headingDescriptionContainer,
    resolversHeading,
    resolverFieldRow
} from "../ResolversListItem.css";

const CustomTypeResolversListItem = ({ schemaId, type, item, onClick }) => {
    const { fields, name } = item;
    return (
        <Query key={name} query={GetResolvers} variables={{ schemaId, type: name }}>
            {({ loading, error, data }) => {
                if (loading) {
                    return <Spinner className="spinner" loading />;
                }
                if (error) {
                    return error.message;
                }

                const definedResolvers = fields.reduce((prev, curr) => {
                    const resolver = data.resolvers.find(r => r.field === curr.name);
                    return resolver ? prev + 1 : prev;
                }, 0);

                const fieldsText = (
                    <div className={headingDescriptionContainer}>
                        <span className={headingDescription}>
                            <span style={{ fontWeight: "600" }}>{fields.length}</span>
                            <span style={{ fontWeight: "300" }}>{fields.length !== 1 ? " Arguments" : " Argument"}</span>
                        </span>
                        <ResolversCount total={fields.length} defined={definedResolvers} />
                    </div>
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
