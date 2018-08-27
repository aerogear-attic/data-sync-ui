import React from "react";

import {
    MessageDialog,
    Icon
} from "patternfly-react";

import { graphql } from "react-apollo";
import DeleteDataSource from "../../graphql/DeleteDataSource.graphql";
import GetDataSources from "../../graphql/GetDataSources.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";

const DeleteDataSourceDialog = ({
    showModal,
    dataSource,
    filter,
    mutate,
    onClose
}) => {
    const hasResolvers = dataSource && dataSource.resolvers && dataSource.resolvers.length;

    const removeDatasource = () => {
        const { name } = filter;
        const dataSourceId = dataSource.id;
        const queriesToRefetch = [{
            query: GetDataSources,
            variables: { name }
        }, {
            query: GetDataSources,
            variables: { name: undefined }
        }];

        if (hasResolvers) {
            dataSource.resolvers.forEach(resolver => {
                queriesToRefetch.push({
                    query: GetResolvers,
                    variables: { schemaId: resolver.GraphQLSchemaId, type: resolver.type }
                });
            });
        }

        mutate({
            variables: { dataSourceId },
            refetchQueries: queriesToRefetch
        }).then(() => {
            onClose();
        }).catch(err => {
            console.error("Error", err);
        });
    };

    const title = `Delete Data Source ${dataSource && dataSource.name}`;
    const icon = hasResolvers ? <Icon type="pf" name="warning-triangle-o" /> : null;
    const primaryContent = (
        <p style={{ fontSize: 18 }}>
            Are you sure you want to delete this data source?
        </p>
    );
    const secondaryContent = hasResolvers
        ? <p>All associated resolvers ({dataSource.resolvers.length}) will be deleted</p>
        : <p>No resolvers will be deleted</p>;

    return (
        <MessageDialog
            title={title}
            icon={icon}
            primaryContent={primaryContent}
            secondaryContent={secondaryContent}
            show={showModal}
            onHide={onClose}

            primaryActionButtonContent="Delete"
            primaryActionButtonBsStyle="danger"
            primaryAction={removeDatasource}

            secondaryActionButtonContent="Cancel"
            secondaryAction={onClose}
        />
    );
};

const DeleteDataSourceWithMutation = graphql(DeleteDataSource)(DeleteDataSourceDialog);
export { DeleteDataSourceWithMutation as DeleteDataSourceDialog };
