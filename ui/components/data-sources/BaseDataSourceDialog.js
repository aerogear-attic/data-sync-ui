import React, { Component } from "react";
import {
    Alert,
    Modal,
    Icon,
    Button,
    Form,
    FormControl,
    FormGroup,
    Col,
    InputGroup,
    DropdownButton,
    MenuItem
} from "patternfly-react";
import some from "lodash.some";

import ApolloClient from "apollo-boost";
import { InMemoryOptions, PostgresOptions } from "./options";
import { DataSourceType } from "../../graphql/types/DataSourceType";
import { Validators, Validate } from "../../helper/Validators";
import TestDataSource from "../../graphql/TestDataSource.graphql";

class BaseDataSourceDialog extends Component {

    onClose() {
        this.clearForms();
        this.props.onClose();
    }

    onNameChange(name) {
        const nameValidation = Validate([
            Validators.String.minLength(1), name,
            Validators.String.maxLength(255), name
        ]);

        const { validations } = this.state;
        const newValidations = { ...validations, name: nameValidation };

        this.setState({ name, validations: newValidations });
    }

    onTypeChange(type) {
        let typeValidation = DataSourceType[type] ? "success" : "error";
        typeValidation = type === DataSourceType.InMemory ? "warning" : typeValidation;

        const { validations } = this.state;
        const newValidations = { ...validations, type: typeValidation };

        this.setState({ type, validations: newValidations });
    }

    onInMemoryOptionsChange(inMemoryOptions) {
        const { timestampData } = inMemoryOptions;

        const optionsValidation = Validate([
            Validators.Boolean.valid, timestampData
        ]);

        const { validations } = this.state;
        const newValidations = { ...validations, optionsValidation };

        this.setState({ inMemoryOptions, validations: newValidations });
    }

    onPostgresOptionsChange(postgresOptions) {
        const { url, port, database, username } = postgresOptions;

        const optionsValidation = Validate([
            Validators.String.nonBlank, url,
            Validators.String.nonBlank, database,
            Validators.String.nonBlank, username,
            Validators.Port.valid, port
        ]);

        const { validations } = this.state;
        const newValidations = { ...validations, optionsValidation };

        this.setState({ postgresOptions, validations: newValidations });
    }

    renderSpecificOptionsFormsForSelectedType() {
        const { type, inMemoryOptions, postgresOptions } = this.state;

        switch (type) {
            case DataSourceType.InMemory:
                return (
                    <InMemoryOptions
                        isDisabled={this.isDisabled}
                        options={inMemoryOptions}
                        onOptionsChange={newOps => this.onInMemoryOptionsChange(newOps)}
                    />
                );
            case DataSourceType.Postgres:
                return (
                    <PostgresOptions
                        isDisabled={this.isDisabled}
                        options={postgresOptions}
                        onOptionsChange={newOps => this.onPostgresOptionsChange(newOps)}
                    />
                );
            default:
                return null;
        }
    }

    getConfigByType(type) {
        switch (type) {
            case DataSourceType.InMemory:
                return this.state.inMemoryOptions;
            case DataSourceType.Postgres:
                return this.state.postgresOptions;
            default:
                throw new Error(`Unknown data source type: ${type}`);
        }
    }

    /**
     * Get the title of the Dialog.
     * @return {string} - The title of the dialog.
     */
    getTitle() {
        throw new Error(`getTitle() not implemented in ${this.constructor.name}`);
    }

    /**
     * Get the title of the submit button.
     * @return {string} - The title of the submit button.
     */
    getSubmitTitle() {
        throw new Error(`getSubmitTitle() not implemented in ${this.constructor.name}`);
    }

    /**
     * Callback attached to the Dialog's submit button.
     */
    onSubmit() {
        throw new Error(`onSubmit() not implemented in ${this.constructor.name}`);
    }

    /**
     * Set initial state to clear al controls, otherwise implement empty.
     */
    clearForms() {
        throw new Error(`clearForms() not implemented in ${this.constructor.name}`);
    }

    /**
     * For a given controlId, return if its control should be disabled.
     * @param {boolean} controlId - The controlId of the control
     * @returns {boolean}
     */
    isDisabled() {
        throw new Error(`isDisabled(controlId: string) not implemented in ${this.constructor.name}`);
    }

    /**
     * Test the data source and show message on the dialog.
     */
    onTest() {
        this.testDataSource()
            .then(() => {
                this.setState({ success: "Connection to data source is successful" });
                this.setState({ err: "" });
            })
            .catch(message => {
                this.setState({ success: "" });
                this.setState({ err: message });
            });
    }

    testDataSource() {
        const { type } = this.state;
        const config = { options: this.getConfigByType(type) };
        const client = new ApolloClient();

        return new Promise((resolve, reject) => {
            client.query({
                query: TestDataSource,
                variables: { config, type }
            }).then(result => {
                const { getDataSourceTestResult: { status, message } } = result.data;
                if (status) {
                    return resolve();
                }

                return reject(message);
            }).catch(err => reject(err.toString()));
        });
    }

    render() {
        const { visible } = this.props;
        const { name, type, err, success, validations } = this.state;
        const submitButtonDisabled = some(validations, s => !s || s === "error");

        return (
            <Modal show={visible}>
                <Modal.Header>
                    <button
                        className="close"
                        aria-hidden="true"
                        onClick={() => this.onClose()}
                        aria-label="Close"
                        type="submit"
                    >
                        <Icon type="pf" name="close" />
                    </button>
                    <Modal.Title>{this.getTitle()}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    {/* Alert */}
                    {err && <Alert onDismiss={() => this.setState({ err: "" })}>{err}</Alert>}
                    {success && <Alert type="success" onDismiss={() => this.setState({ success: "" })}>{success}</Alert>}

                    {type === DataSourceType.InMemory && (
                        <Alert type="warning">
                            In memory data sources are not meant for production.
                        </Alert>
                    )}

                    <Form horizontal>

                        {/* Data Source Name */}
                        <FormGroup controlId="name" validationState={validations.name}>
                            <Col sm={3}>Data Source Name</Col>
                            <Col sm={9}>
                                <FormControl
                                    disabled={this.isDisabled("name")}
                                    type="text"
                                    value={name}
                                    onChange={e => this.onNameChange(e.target.value)}
                                />
                            </Col>
                        </FormGroup>

                        {/* Data Source Type */}
                        <FormGroup controlId="type" validationState={validations.type}>
                            <Col sm={3}>Data Source Type</Col>
                            <Col sm={9}>
                                <InputGroup>
                                    <FormControl
                                        disabled
                                        style={{ backgroundColor: "#fff", color: "#363636" }}
                                        value={type}
                                    />
                                    <InputGroup.Button>
                                        <DropdownButton
                                            disabled={this.isDisabled("type")}
                                            bsStyle="default"
                                            id="dropdown-type"
                                            title=""
                                            onSelect={key => this.onTypeChange(key)}
                                        >
                                            <MenuItem eventKey={DataSourceType.InMemory}>
                                                {DataSourceType.InMemory}
                                            </MenuItem>
                                            <MenuItem eventKey={DataSourceType.Postgres}>
                                                {DataSourceType.Postgres}
                                            </MenuItem>
                                            {/* More Data Source Types to be added */}
                                        </DropdownButton>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                            {/* <HelpBlock>Validation is based on string length.</HelpBlock> */}
                        </FormGroup>

                        {/* Specific forms depending on Data Source Type */}
                        {this.renderSpecificOptionsFormsForSelectedType()}

                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    {type === DataSourceType.Postgres && (
                        <Button
                            bsStyle="info"
                            onClick={() => this.onTest()}
                            disabled={submitButtonDisabled}
                        >
                            Test
                        </Button>
                    )}
                    <Button
                        bsStyle="default"
                        className="btn-cancel"
                        onClick={() => this.onClose()}
                    >
                        Cancel
                    </Button>
                    <Button
                        bsStyle="primary"
                        onClick={() => this.onSubmit()}
                        disabled={submitButtonDisabled}
                    >
                        {this.getSubmitTitle()}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default BaseDataSourceDialog;
