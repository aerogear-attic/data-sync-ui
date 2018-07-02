import React, { Component } from "react";
import { CommonToolbar } from "./common/CommonToolbar"
import gql from "graphql-tag";
import { Query } from "react-apollo";
import { ListView, DropdownKebab, Modal, Icon} from "patternfly-react";

const GET_DATA_SOURCES = gql`
    {
        dataSources {
            id
            name
            type
        }
    }
`;

const DataSourceDialog = (props) => {
    return (
        <Modal show={props.visible}>
            <Modal.Header>
                <button
                    className="close"
                    aria-hidden="true"
                    onClick={props.onClose}
                    aria-label="Close">
                    <Icon type="pf" name="close" />
                </button>
                <Modal.Title>{props.text}</Modal.Title>
            </Modal.Header>
        </Modal>
    );
};

const DataSources = () => {
    return <Query query={GET_DATA_SOURCES}>
        {({loading, error, data}) => {
            if (loading) return "Loading...";
            if (error) return error.message;

            const items = data.dataSources.map((item, idx) => {
                return (
                    <ListView.Item
                        id={idx.toString()}
                        key={idx}
                        className="ds-list-item"
                        heading={item.type}
                        description="---"
                        leftContent={<span className="list-item-name">{item.name}</span>}
                        actions={
                            <div>
                                <DropdownKebab id="DataSource Dropdown" pullRight>
                                </DropdownKebab>
                            </div>
                        }
                    >
                    </ListView.Item>
                )
            });

            return (
                <div>
                    <ListView>
                        {items}
                    </ListView>
                </div>
            );
        }}
    </Query>
};

class DataSourcesView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalText: null
        };

        this.addDatasource = this.addDatasource.bind(this);
        this.closeDialog = this.closeDialog.bind(this);
    }

    getToolbarButtons() {
        return [
            {title: "Add new Data Source", cb: this.addDatasource}
        ];
    }

    addDatasource() {
        this.setState({
            showModal: true,
            modalText: "Create new Data Source"
        });
    }

    closeDialog() {
        this.setState({
            showModal: false
        });
    }

    render() {
        return (
          <div>
              <DataSourceDialog
                    onClose={this.closeDialog}
                    visible={this.state.showModal}
                    text={this.state.modalText} />
              <CommonToolbar buttons={this.getToolbarButtons()}/>
              <div>
                  <DataSources/>
              </div>
          </div>
        );
    }
}


export default DataSourcesView;
