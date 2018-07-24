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
    height: "0",
    schema: "",
    error: null,
    saved: true
};

class SchemaContainer extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.flexWrapper = React.createRef();
    }

    updateDimensions() {
        this.setState({
            height: window.innerHeight - this.flexWrapper.current.getBoundingClientRect().top
        });
    }

    componentDidUpdate() {
        const flexWrapperElement = this.flexWrapper.current;
        const currentHeight = flexWrapperElement.style.height;
        const distanceFromTop = flexWrapperElement.getBoundingClientRect().top;
        if (currentHeight === "0px" && distanceFromTop !== 0) {
            this.updateDimensions();
        }
    }

    componentDidMount() {
        window.addEventListener("resize", () => this.updateDimensions());
    }

    componentWillUnmount() {
        window.removeEventListener("resize", () => this.updateDimensions());
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
                saved: true
            });
        }).catch(error => {
            this.setState({
                error
            });
        });
    }

    getToolbarButtons() {
        const { getSchema: { id, valid } } = this.props.data;
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

    renderLoading() {
        return <Spinner className="spinner" loading />;
    }

    renderContent() {
        const { getSchema: { id, schema, compiled } } = this.props.data;
        return (
            <React.Fragment>
                <CommonToolbar buttons={this.getToolbarButtons()} />
                <div
                    ref={this.flexWrapper}
                    className={style.flexWrapper}
                    style={{ height: this.state.height }}
                >
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
