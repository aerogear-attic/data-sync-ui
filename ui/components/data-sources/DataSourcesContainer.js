import React, { Component } from "react";

import { CommonToolbar } from "../common";
import { AddDataSourceDialog } from "./AddDataSourceDialog";
import { DataSourcesList } from "./DataSourcesList";
import { DeleteDataSourceDialog } from "./DeleteDataSourceDialog";

class DataSourcesContainer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            showDeleteModal: false,
            filter: {},
            selectedDataSource: null
        };
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

    deleteDataSource(dataSource) {
        this.setState({ showDeleteModal: true, selectedDataSource: dataSource });
    }

    render() {
        const { showModal, filter, showDeleteModal, selectedDataSource } = this.state;
        return (
            <div>
                <AddDataSourceDialog
                    onClose={() => this.closeDialog()}
                    visible={showModal}
                />
                <DeleteDataSourceDialog
                    showModal={showDeleteModal}
                    dataSource={selectedDataSource}
                    onClose={() => this.setState({ showDeleteModal: false })}
                />
                <CommonToolbar
                    buttons={this.getToolbarButtons()}
                    onFilter={name => {
                        let nameToFilter = name;
                        if (nameToFilter === "") {
                            nameToFilter = undefined;
                        }
                        this.setFilter(nameToFilter);
                    }}
                />
                <div>
                    <DataSourcesList
                        filter={filter}
                        onCreate={() => {
                            this.addDataSource();
                        }}
                        onDeleteDataSource={dataSource => this.deleteDataSource(dataSource)}
                    />
                </div>
            </div>
        );
    }

}

export { DataSourcesContainer };
