import React, { Component } from "react";
import {
    Form,
    FormGroup,
    FormControl,
    InputGroup,
    Col,
    Button,
    DropdownButton,
    MenuItem,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";

import { CodeEditor } from "../common/CodeEditor";
import { DataSourcesDropDown } from "./DataSourcesDropDown";
import { Security } from "./Security";

import styles from "./ResolverDetail.css";

const INITIAL_STATE = {
    dataSource: null,
    requestMapping: "",
    responseMapping: "",
    err: "",
    validations: {
        name: null,
        requestMapping: "warning",
        responseMapping: "success"
    }
};

class ResolverDetail extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.dataSource !== nextProps.dataSource) {
            this.setState({ dataSource: nextProps.dataSource });
        }
    }

    save() {
        console.log("called save");
    }

    cancel() {
        console.log("called cancel");
    }

    renderEmptyScreen() {
        return (
            <EmptyState className={styles.detailEmpty}>
                <EmptyStateIcon name="info" />
                <EmptyStateTitle className={styles.emptyTitle}>
                    Select an item to view and edit its details
                </EmptyStateTitle>
            </EmptyState>
        );
    }

    render() {
        const { dataSource, responseMapping, requestMapping, validations } = this.state;

        if (!dataSource) {
            return this.renderEmptyScreen();
        }

        return (
            <React.Fragment>
                <div className={styles.resolverHeader}>
                    <span>Resolver</span>
                </div>
                <Form horizontal className={styles.resolverDetailsArea}>
                    <FormGroup controlId="dataSource" validationState={validations.name}>
                        <Col sm={2}><b>Data Source</b></Col>
                        <Col sm={10}>
                            <DataSourcesDropDown dataSourceName={dataSource.name} />
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="">
                        <Col sm={9}><b>Request Mapping Template</b></Col>
                        <Col sm={3} className="pull-right">
                            <InputGroup>
                                <FormControl
                                    disabled
                                    style={{ backgroundColor: "#fff", color: "#363636" }}
                                    value="Custom"
                                />
                                <InputGroup.Button>
                                    <DropdownButton
                                        disabled={false}
                                        bsStyle="default"
                                        id="dropdown-type"
                                        title=""
                                        onSelect={() => {
                                            console.log("on select called");
                                        }}
                                    >
                                        <MenuItem>
                                            Custom
                                        </MenuItem>
                                    </DropdownButton>
                                </InputGroup.Button>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    {/* Resolver request mapping */}
                    <FormGroup controlId="requestMapping" validationState={validations.requestMapping}>
                        <Col sm={12}>
                            <div className={styles.resolverInputArea}>
                                <CodeEditor
                                    value={requestMapping}
                                    onChange={() => {
                                        console.log("on change");
                                    }}
                                />
                            </div>
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="">
                        <Col sm={9}><b>Response Mapping Template</b></Col>
                        <Col sm={3} className="pull-right">
                            <InputGroup>
                                <FormControl
                                    disabled
                                    style={{ backgroundColor: "#fff", color: "#363636" }}
                                    value="Custom"
                                />
                                <InputGroup.Button>
                                    <DropdownButton
                                        disabled={false}
                                        bsStyle="default"
                                        id="dropdown-type"
                                        title=""
                                        onSelect={() => {
                                            console.log("on select called");
                                        }}
                                    >
                                        <MenuItem>
                                            Custom
                                        </MenuItem>
                                    </DropdownButton>
                                </InputGroup.Button>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    {/* Resolver response mapping */}
                    <FormGroup controlId="responseMapping" validationState={validations.responseMapping}>
                        <Col sm={12}>
                            <div className={styles.resolverInputArea}>
                                <CodeEditor
                                    value={responseMapping}
                                    onChange={() => {
                                        console.log("on change");
                                    }}
                                />
                            </div>
                        </Col>
                    </FormGroup>
                </Form>
                <Security />
                <div className={styles.resolverButtons}>
                    <Button
                        className={styles.buttonSave}
                        bsStyle="primary"
                        onClick={() => this.save()}
                    >
                        Save
                    </Button>
                    <Button
                        bsStyle="default"
                        onClick={() => this.cancel()}
                    >
                        Cancel
                    </Button>
                </div>
            </React.Fragment>
        );
    }

}

export { ResolverDetail };
