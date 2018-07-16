import React from "react";

import { MessageDialog } from "patternfly-react";

import { graphql } from "react-apollo";
import DeleteDataSource from "../../graphql/DeleteDataSource.graphql";
import GetDataSources from "../../graphql/GetDataSources.graphql";

const DeleteDataSourceDialog = ({ showModal, dataSource, filter, mutate, onClose }) => {
    const removeOneDatasource = dataSourceId => {
        const { name } = filter;
        mutate({
            variables: { dataSourceId },
            refetchQueries: [{
                query: GetDataSources,
                variables: { name }
            }, {
                query: GetDataSources,
                variables: { name: undefined }
            }]
        }).then(() => {
            onClose();
        }).catch(err => {
            console.error("Error", err);
        });
    };

    const primaryContent = (<p>Are you sure you want to delete this data source?</p>);
    const title = `Delete Data Source ${dataSource && dataSource.name}`;
    return (
        <MessageDialog
            show={showModal}
            onHide={() => {}}
            primaryAction={() => removeOneDatasource(dataSource.id)}
            secondaryAction={() => onClose()}
            primaryActionButtonContent="Delete"
            secondaryActionButtonContent="Cancel"
            title={title}
            primaryContent={primaryContent}
        />
    );
};

const DeleteDataSourceWithMutation = graphql(DeleteDataSource)(DeleteDataSourceDialog);
export { DeleteDataSourceWithMutation as DeleteDataSourceDialog };
