import React, { Component } from "react";
import { Query } from "react-apollo";
import {
    Form,
    FormGroup,
    FormControl,
    InputGroup,
    Col,
    DropdownButton,
    Spinner,
    MenuItem
} from "patternfly-react";

import { CodeEditor } from "../common/CodeEditor";
import styles from "./resolversContainer.css";
import GetDataSources from "../../graphql/GetDataSources.graphql";
import { Row } from "../../../node_modules/patternfly-react/dist/js/components/Grid";

const INITIAL_STATE = {
    dataSourceName: "",
    requestMapping: "",
    responseMapping: "",
    err: "",
    validations: {
        dataSourceName: null,
        requestMapping: "warning",
        responseMapping: "success"
    }
};

class ResolverDetail extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    renderDataSources() {
        const filter = undefined;
        return (
            <Query query={GetDataSources} variables={filter}>
                {({ loading, error, data }) => {
                    if (loading) {
                        return <Spinner className="spinner" loading />;
                    }
                    if (error) {
                        return error.message;
                    }
                    if (data.dataSources.length) {
                        const { dataSources } = data;
                        return dataSources.map(dataSource => (
                            <MenuItem key={dataSource.name} eventKey={dataSource}>
                                {`${dataSource.name} (${dataSource.type})`}
                            </MenuItem>
                        ));
                    }
                    return null;
                }}
            </Query>
        );
    }

    render() {
        const { dataSourceName, responseMapping, requestMapping, validations } = this.state;
        return (
            <div>
                <div className={styles.resolverHeader}>
                    <span>Resolver</span>
                </div>
                <Form horizontal className={styles.resolverDetailsArea}>
                    <FormGroup controlId="dataSource" validationState={validations.dataSourceName}>
                        <Col sm={2}><b>Data Source</b></Col>
                        <Col sm={10} style={{ width: "350px" }}>
                            <InputGroup>
                                <FormControl
                                    disabled
                                    style={{ backgroundColor: "#fff", color: "#363636" }}
                                    value={dataSourceName}
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
                                        {this.renderDataSources()}
                                    </DropdownButton>
                                </InputGroup.Button>
                            </InputGroup>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="">
                        <Col sm={10}><b>Request Mapping Template</b></Col>
                        <Col sm={2} className="pull-right">
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
                        <Col sm={10}><b>Response Mapping Template</b></Col>
                        <Col sm={2} className="pull-right">
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
                {this.renderSecurity()}
            </div>
        );
    }

    renderSecurity() {
        return (
            <div>
                <div className={styles.resolverHeader}>
                    <span>Security</span>
                </div>
                <Form horizontal className={styles.resolverDetailsArea}>
                    <Row>
                        <Col sm={4}>Add a Keycloak role to this object</Col>
                    </Row>
                    <FormGroup controlId="role">
                        <Col sm={10} style={{ width: "350px" }}>
                            <InputGroup>
                                <FormControl
                                    disabled
                                    style={{ backgroundColor: "#fff", color: "#363636" }}
                                    value="AppDeveloper"
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
                                            AppDeveloper
                                        </MenuItem>
                                    </DropdownButton>
                                </InputGroup.Button>
                            </InputGroup>
                        </Col>
                    </FormGroup>
                </Form>
            </div>
        );
    }

}

export { ResolverDetail };
