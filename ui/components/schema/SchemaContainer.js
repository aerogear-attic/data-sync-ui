import React, {Component} from "react";
import {graphql} from "react-apollo";
import GetSchema from "../../graphql/GetSchema.graphql";
import {CommonToolbar} from "../common";

import style from "./schemaContainer.css";

class SchemaContainer extends Component {
    constructor(props) {
        super(props);
    }

    getToolbarButtons() {
        const { getSchema: { valid } } = this.props.data;
        return [
            {title: "Export", cb: () => this.export(), id: "export_schema", enabled: valid}
        ];
    }

    renderLoading() {
        return <div>Loading...</div>;
    }

    renderContent() {
        return (<div>
            <CommonToolbar buttons={this.getToolbarButtons()}/>
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
})(SchemaContainer);

export {SchemaContainerWithQuery as SchemaContainer};
