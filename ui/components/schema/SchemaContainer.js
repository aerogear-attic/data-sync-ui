import React, { Component } from "react";
import { graphql } from "react-apollo";
import keydown from "react-keydown";
import { Spinner } from "patternfly-react";
import { CommonToolbar, CodeEditor } from "../common";
import { StructureView } from "./StructureView";

import GetSchema from "../../graphql/GetSchema.graphql";
import UpdateSchema from "../../graphql/UpdateSchema.graphql";

import style from "./schemaContainer.css";

const INITIAL_STATE = {
    height: "100%",
    schema: "",
    error: null,
    saving: false,
    saved: true
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
                title: "Download Schema",
                props: {
                    key: "export_schema",
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
        const { getSchema: { id, schema, compiled } } = this.props.data;
        const { error, saving } = this.state;
        return (
            <React.Fragment>
                <CommonToolbar buttons={this.getToolbarButtons()} />
                <div className={style.flexWrapper} style={{ height: this.state.height }}>
                    <div className={style.left}>
                        <CodeEditor
                            value={schema}
                            onChange={updated => this.onSchemaChange(updated)}
                            disabled={saving}
                        />
                    </div>
                    <div className={style.right}>
                        <StructureView
                            compiled={JSON.parse(compiled)}
                            error={error}
                            schemaId={id}
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
