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
            {
                title: "Add Data Source",
                props: {
                    onClick: () => this.addDataSource(),
                    key: "add_new_data_source"
                }
            }
        ];
    }

    onFilterChange(newFilter) {
        if (newFilter.name === "") {
            newFilter.name = undefined;
        }
        const { filter } = this.state;
        this.setState({ filter: { ...filter, ...newFilter } });
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

    clearFilter() {
        this.setState({ filter: {} });
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
            <React.Fragment>
                <AddDataSourceDialog
                    onClose={() => this.setState({ showAddModal: false })}
                    visible={showAddModal}
                    filter={filter}
                />
                <EditDataSourceDialog
                    onClose={() => this.setState({
                        showEditModal: false,
                        selectedDataSource: null
                    })}
                    dataSource={selectedDataSource}
                    visible={showEditModal}
                />
                <DeleteDataSourceDialog
                    showModal={showDeleteModal}
                    dataSource={selectedDataSource}
                    filter={filter}
                    onClose={() => this.setState({
                        showDeleteModal: false,
                        selectedDataSource: null
                    })}
                />
                <CommonToolbar
                    buttons={this.getToolbarButtons()}
                    showFilterSearch
                    onFilterChange={f => this.onFilterChange(f)}
                    filter={filter}
                />
                <div>
                    <DataSourcesList
                        filter={filter}
                        onCreate={() => this.addDataSource()}
                        onEditDataSource={dataSource => this.editDataSource(dataSource)}
                        onDeleteDataSource={dataSource => this.deleteDataSource(dataSource)}
                        onClearFilter={() => this.clearFilter()}
                    />
                </div>
            </React.Fragment>
        );
    }

}

export { DataSourcesContainer };
