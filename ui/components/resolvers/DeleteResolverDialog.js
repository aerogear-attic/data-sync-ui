import React from "react";

import { MessageDialog } from "patternfly-react";
import { graphql } from "react-apollo";
import DeleteResolver from "../../graphql/DeleteResolver.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";

const DeleteResolverDialog = ({
    showModal,
    resolver,
    mutate,
    onDelete,
    onClose
}) => {
    const removeResolver = () => {
        const resolverId = resolver.id;
        const { schemaId, type } = resolver;
        mutate({
            variables: { resolverId },
            refetchQueries: [{ query: GetResolvers, variables: { schemaId, type } }]
        }).then(() => {
            onDelete();
        }).catch(err => {
            console.error("Error", err);
        });
    };

    const title = `Delete Resolver ${resolver.id}`;
    const primaryContent = (
        <p style={{ fontSize: 18 }}>
            Are you sure you want to delete this resolver?
        </p>
    );

    return (
        <MessageDialog
            title={title}
            primaryContent={primaryContent}
            show={showModal}
            onHide={onClose}

            primaryActionButtonContent="Delete"
            primaryActionButtonBsStyle="danger"
            primaryAction={removeResolver}

            secondaryActionButtonContent="Cancel"
            secondaryAction={onClose}
        />
    );
};

const DeleteResolverWithMutation = graphql(DeleteResolver)(DeleteResolverDialog);
export { DeleteResolverWithMutation as DeleteResolverDialog };
