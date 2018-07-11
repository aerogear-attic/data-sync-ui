import React, {Component} from "react";
import {graphql} from "react-apollo";
import GetSchema from "../../graphql/GetSchema.graphql";
import {CommonToolbar} from "../common";

import style from "./schemaContainer.css";

class SchemaContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            height: "100%"
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

    getToolbarButtons() {
        const { getSchema: { valid } } = this.props.data;
        return [
            {title: "Export as JSON", cb: () => this.export(), id: "export_schema", enabled: valid}
        ];
    }

    renderLoading() {
        return <div>Loading...</div>;
    }

    renderContent() {
        return (<div>
            <CommonToolbar buttons={this.getToolbarButtons()}/>
            <div className={style.flexWrapper} style={{height: this.state.height}}>
                <div className={style.left}>

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
})(SchemaContainer);

export {SchemaContainerWithQuery as SchemaContainer};
