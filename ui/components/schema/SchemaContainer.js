import React, { Component } from "react";
import { graphql } from "react-apollo";
import keydown from "react-keydown";
import { Spinner } from "patternfly-react";
import { CommonToolbar, CodeEditor } from "../common";
import { StructureView } from "./StructureView";
import { AddResolverDialog } from "./AddResolverDialog";
import GetSchema from "../../graphql/GetSchema.graphql";
import UpdateSchema from "../../graphql/UpdateSchema.graphql";
import { EditResolverDialog } from "./EditResolverDialog";

import style from "./schemaContainer.css";

const INITIAL_STATE = {
    height: "100%",
    schema: "",
    error: null,
    saved: true,
    showAddModal: false,
    showEditModal: false,
    selectedResolver: null
};

class SchemaContainer extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    updateDimensions() {
        this.setState({
            height: window.innerHeight - this.calculateHeaderHeight()
        });
    }

    componentWillMount() {
        this.updateDimensions();
    }

    componentDidMount() {
        window.addEventListener("resize", () => this.updateDimensions());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => this.updateDimensions());
    }

    calculateHeaderHeight() {
        // TODO: find SOME way to do this in pure CSS
        return 206;
    }

    onSchemaChange(schema) {
        this.setState({ schema, saved: false });
    }

    @keydown("ctrl + s")
    saveShortcut(e) {
        e.preventDefault();

        const { saved } = this.state;

        if (!saved) {
            this.save();
        }
    }

    save() {
        const { schema } = this.state;
        const { getSchema } = this.props.data;

        this.props.mutate({
            variables: {
                id: getSchema.id,
                schema: schema || getSchema.schema
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
                saved: true
            });
        }).catch(error => {
            this.setState({
                error
            });
        });
    }

    getToolbarButtons() {
        const { data: { getSchema: { id, valid } } } = this.props;
        const { saved } = this.state;

        return [
            {
                title: "Download Schema",
                props: {
                    key: "export_schema",
                    disabled: !valid,
                    href: `/schema/${id}`
                }
            },
            {
                title: "Save Schema",
                props: {
                    onClick: () => this.save(),
                    key: "save_schema",
                    disabled: saved
                }
            }
        ];
    }

    addResolver() {
        this.setState({ showAddModal: true });
    }

    editResolver(resolver) {
        this.setState({ showEditModal: true, selectedResolver: resolver });
    }

    renderLoading() {
        return <Spinner className="spinner" loading />;
    }

    renderContent() {
        const { data: { getSchema: { id, schema, compiled } } } = this.props;
        const { showAddModal, showEditModal, selectedResolver } = this.state;

        return (
            <React.Fragment>
                <CommonToolbar buttons={this.getToolbarButtons()} />
                <div className={style.flexWrapper} style={{ height: this.state.height }}>
                    <div className={style.left}>
                        <CodeEditor
                            value={schema}
                            onChange={updated => this.onSchemaChange(updated)}
                        />
                    </div>
                    <div className={style.right}>
                        <StructureView
                            compiled={JSON.parse(compiled)}
                            error={this.state.error}
                            schemaId={id}
                            onAddResolver={() => this.addResolver()}
                            onEditResolver={() => this.editResolver()}
                        />
                    </div>
                </div>
                <AddResolverDialog
                    onClose={() => this.setState({ showAddModal: false })}
                    visible={showAddModal}
                />
                <EditResolverDialog
                    onClose={() => this.setState({ showEditModal: false,
                        selectedResolver: null })}
                    resolver={selectedResolver}
                    visible={showEditModal}
                />
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
