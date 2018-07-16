import React, { Component } from "react";

import { CommonToolbar } from "../common";
import { AddDataSourceDialog } from "./AddDataSourceDialog";
import { EditDataSourceDialog } from "./EditDataSourceDialog";
import { DataSourcesList } from "./DataSourcesList";
import { DeleteDataSourceDialog } from "./DeleteDataSourceDialog";

const INITIAL_STATE = {
    showAddModal: false,
    showEditModal: false,
    showDeleteModal: false,
    filter: {},
    selectedDataSource: null
};

class DataSourcesContainer extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    getToolbarButtons() {
        return [
            { title: "Add Data Source", cb: () => this.addDataSource(), id: "add_new_data_source" }
        ];
    }

    setFilter(nameToFilter) {
        let name = nameToFilter;
        if (name === "") {
            name = undefined;
        }
        this.setState({ filter: { name } });
    }

    addDataSource() {
        this.setState({ showAddModal: true });
    }

    editDataSource(dataSource) {
        this.setState({ showEditModal: true, selectedDataSource: dataSource });
    }

    deleteDataSource(dataSource) {
        this.setState({ showDeleteModal: true, selectedDataSource: dataSource });
    }

    render() {
        const {
            showAddModal,
            showEditModal,
            showDeleteModal,
            filter,
            selectedDataSource
        } = this.state;

        return (
            <div>
                <AddDataSourceDialog
                    onClose={() => this.setState({ showAddModal: false })}
                    visible={showAddModal}
                />
                <EditDataSourceDialog
                    onClose={() => this.setState({ showEditModal: false, selectedDataSource: null })}
                    dataSource={selectedDataSource}
                    visible={showEditModal}
                />
                <DeleteDataSourceDialog
                    showModal={showDeleteModal}
                    dataSource={selectedDataSource}
                    onClose={() => this.setState({ showDeleteModal: false, selectedDataSource: null })}
                />
                <CommonToolbar
                    buttons={this.getToolbarButtons()}
                    onFilter={name => this.setFilter(name)}
                />
                <div>
                    <DataSourcesList
                        filter={filter}
                        onCreate={() => this.addDataSource()}
                        onEditDataSource={dataSource => this.editDataSource(dataSource)}
                        onDeleteDataSource={dataSource => this.deleteDataSource(dataSource)}
                    />
                </div>
            </div>
        );
    }

}

export { DataSourcesContainer };
