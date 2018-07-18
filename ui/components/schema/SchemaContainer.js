import React, { Component } from "react";
import { graphql } from "react-apollo";
import { Spinner } from "patternfly-react";
import GetSchema from "../../graphql/GetSchema.graphql";
import UpdateSchema from "../../graphql/UpdateSchema.graphql";
import { CommonToolbar, CodeEditor } from "../common";
import { StructureView } from "./StructureView";

import style from "./schemaContainer.css";

const INITIAL_STATE = {
    height: "0",
    schema: "",
    error: null
};

class SchemaContainer extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
        this.flexWrapper = null;

        this.setflexWrapperRef = e => {
            this.flexWrapper = e;
        };
    }

    updateDimensions() {
        this.setState({
            height: window.innerHeight - this.flexWrapper.getBoundingClientRect().top
        });
    }

    componentDidUpdate() {
        const currentHeight = this.flexWrapper.style.height;
        const distanceFromTop = this.flexWrapper.getBoundingClientRect().top;
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
        this.setState({ schema });
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
                error: null
            });
        }).catch(error => {
            this.setState({
                error
            });
        });
    }

    getToolbarButtons() {
        const { getSchema: { id, valid } } = this.props.data;
        return [
            {
                title: "Download Schema",
                id: "export_schema",
                enabled: valid,
                props: { href: `/schema/${id}` }
            },
            {
                title: "Save Schema",
                cb: () => this.save(),
                id: "save_schema",
                enabled: true
            }
        ];
    }

    renderLoading() {
        return <Spinner className="spinner" loading />;
    }

    renderContent() {
        const { getSchema: { schema, compiled } } = this.props.data;
        return (
            <React.Fragment>
                <CommonToolbar buttons={this.getToolbarButtons()} />
                <div ref={this.setflexWrapperRef} className={style.flexWrapper} style={{ height: this.state.height }}>
                    <div className={style.left}>
                        <CodeEditor
                            value={schema}
                            onChange={updated => this.onSchemaChange(updated)}
                        />
                    </div>
                    <div className={style.right}>
                        <StructureView compiled={JSON.parse(compiled)} error={this.state.error} />
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
