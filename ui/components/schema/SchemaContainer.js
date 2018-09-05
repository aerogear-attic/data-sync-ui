import React, { Component } from "react";
import { graphql } from "react-apollo";
import keydown from "react-keydown";
import { Spinner } from "patternfly-react";
import { CommonToolbar, CodeEditor } from "../common";
import { StructureView } from "./StructureView";

import GetSchema from "../../graphql/GetSchema.graphql";
import UpdateSchema from "../../graphql/UpdateSchema.graphql";

import styles from "./schemaContainer.css";

const INITIAL_STATE = {
    schema: "",
    compiled: null,
    schemaId: null,
    error: null,
    saving: false,
    saved: true
};

class SchemaContainer extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentWillReceiveProps({ data: { getSchema } }) {
        if (this.props.data.getSchema !== getSchema) {
            this.setState({
                schema: getSchema.schema,
                compiled: getSchema.compiled,
                schemaId: getSchema.id
            });
        }
    }

    onSchemaChange(schema) {
        this.setState({ schema, saved: false });
    }

    @keydown("ctrl + s", "cmd + s")
    saveShortcut(e) {
        e.preventDefault();

        const { saved, saving } = this.state;

        if (saved || saving) {
            return;
        }
        this.save();
    }

    save() {
        const { schema } = this.state;
        const { getSchema } = this.props.data;

        this.setState({ saving: true });

        this.props.mutate({
            variables: {
                id: getSchema.id,
                schema
            },
            refetchQueries: [{
                query: GetSchema,
                variables: {
                    name: "default"
                }
            }]
        }).then(() => {
            this.setState({
                error: null,
                saving: false,
                saved: true
            });
        }).catch(error => {
            this.setState({
                error,
                saving: false
            });
        });
    }

    getToolbarButtons() {
        const { getSchema: { id, valid } } = this.props.data;
        const { saved, saving } = this.state;

        return [
            {
                title: "Download Compiled Schema",
                props: {
                    key: "export_schema",
                    bsStyle: "default",
                    disabled: !valid || saving,
                    href: `/schema/${id}`
                }
            },
            {
                title: (saving && "Saving Schema...") || (saved && "Schema saved") || "Save Schema",
                props: {
                    onClick: () => this.save(),
                    key: "save_schema",
                    disabled: saved || saving
                }
            }
        ];
    }

    renderLoading() {
        return <Spinner className="spinner" loading />;
    }

    renderContent() {
        const { error, saving, schema, compiled, schemaId } = this.state;
        const { editorContainer, structureViewContainer, schemaContainer } = styles;

        return (
            <React.Fragment>
                <CommonToolbar buttons={this.getToolbarButtons()} />
                <div className={schemaContainer}>
                    <div className={editorContainer}>
                        <CodeEditor
                            value={schema}
                            onChange={updated => this.onSchemaChange(updated)}
                            disabled={saving}
                        />
                    </div>
                    <div className={structureViewContainer}>
                        <StructureView
                            compiled={JSON.parse(compiled)}
                            error={error}
                            schemaId={schemaId}
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { data } = this.props;
        if (data.loading) {
            return this.renderLoading();
        }

        return this.renderContent();
    }

}

// Automatically fetch the default schema
const SchemaContainerWithQuery = graphql(GetSchema, {
    options: () => ({ variables: { name: "default" } })
})(graphql(UpdateSchema)(SchemaContainer));

export { SchemaContainerWithQuery as SchemaContainer };
