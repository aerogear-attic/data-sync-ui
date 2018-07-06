import React, { Component } from "react";

import { CommonToolbar } from "../common";
import { AddDataSourceDialog } from "./AddDataSourceDialog";
import { DataSourcesList } from "./DataSourcesList";

class DataSourcesContainer extends Component {

    constructor(props) {
        super(props);
        this.state = { showModal: false };
    }

    getToolbarButtons() {
        return [
            { title: "Add new Data Source", cb: () => this.addDataSource(), id: "add_new_data_source" }
        ];
    }

    setFilter(name) {
        this.setState({ filter: { name } });
    }

    addDataSource() {
        this.setState({ showModal: true });
    }

    closeDialog() {
        this.setState({ showModal: false });
    }

    render() {
        const { showModal } = this.state;
        return (
            <div>
                <AddDataSourceDialog
                    onClose={() => this.closeDialog()}
                    visible={showModal}
                />
                <CommonToolbar
                    buttons={this.getToolbarButtons()}
                    onFilter={name => {
                        this.setFilter(name);
                    }}
                />
                <div>
                    <DataSourcesList filter={this.state.filter} /> {/*eslint-disable-line*/}
                </div>
            </div>
        );
    }

}

export { DataSourcesContainer };
