import React, {Component} from "react";
import {graphql} from "react-apollo";
import GetSchema from "../../graphql/GetSchema.graphql";
import UpdateSchame from "../../graphql/UpdateSchema.graphql";
import {CommonToolbar, CodeEditor} from "../common";

import style from "./schemaContainer.css";

class SchemaContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: "100%",
            schema: "",
            error: null,
            compiled: null
        }
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
        this.setState({ schema });
    }

    export() {
        const { getSchema: { id } } = this.props.data;
        const path = `/schema/${id}`;
        const link = document.createElement("A");
        link.href = path;
        link.download = path.substr(path.lastIndexOf('/') + 1);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
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
        }).then(({ data }) => {
            const { updateSchema: { compiled } } = data;
            this.setState({
                error: null,
                compiled
            });
        }).catch(error => {
            this.setState({
                error,
                compiled: null
            });
        });
    }

    getToolbarButtons() {
        const { getSchema: { valid } } = this.props.data;
        return [
            {
                title: "Download Schema",
                cb: () => this.export(),
                id: "export_schema",
                enabled: valid
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
        return <div>Loading...</div>;
    }

    renderContent() {
        const { getSchema: { schema } } = this.props.data;
        return (<div>
            <CommonToolbar buttons={this.getToolbarButtons()}/>
            <div className={style.flexWrapper} style={{height: this.state.height}}>
                <div className={style.left}>
                    <CodeEditor value={schema} onChange={schema => this.onSchemaChange(schema)} />
                </div>
                <div className={style.right}>
                </div>
            </div>
        </div>);
    }

    render() {
        const {data} = this.props;
        if (data.loading) {
            return this.renderLoading();
        }

        return this.renderContent();
    }
}

// Automatically fetch the default schema
const SchemaContainerWithQuery = graphql(GetSchema, {
    options: () => ({variables: {name: "default"}})
})(graphql(UpdateSchame)(SchemaContainer));

export {SchemaContainerWithQuery as SchemaContainer};
