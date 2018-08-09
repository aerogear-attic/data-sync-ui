import React from "react";

import { MessageDialog, Spinner } from "patternfly-react";
import { graphql, Query } from "react-apollo";
import DeleteResolver from "../../graphql/DeleteResolver.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";
import GetSchema from "../../graphql/GetSchema.graphql";


const DeleteResolverDialog = ({
    showModal,
    resolver,
    mutate,
    onDelete,
    onClose
}) => {
    const removeResolver = schemaId => {
        const { id, type } = resolver;
        mutate({
            variables: { resolverId: id },
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
        <Query query={GetSchema} variables={{ name: "default" }}>
            {({ loading, error, data }) => {
                if (loading) {
                    return <Spinner className="spinner" loading />;
                }
                if (error) {
                    return error.message;
                }

                const { getSchema: { id } } = data;

                return (
                    <MessageDialog
                        title={title}
                        primaryContent={primaryContent}
                        show={showModal}
                        onHide={onClose}
                        primaryActionButtonContent="Delete"
                        primaryActionButtonBsStyle="danger"
                        primaryAction={() => removeResolver(id)}
                        secondaryActionButtonContent="Cancel"
                        secondaryAction={onClose}
                    />
                );
            }}
        </Query>
    );
};

const DeleteResolverWithMutation = graphql(DeleteResolver)(DeleteResolverDialog);
export { DeleteResolverWithMutation as DeleteResolverDialog };
