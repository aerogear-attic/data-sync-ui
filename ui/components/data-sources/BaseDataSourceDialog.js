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

import { InMemoryOptions } from "./options";
import { DataSourceType } from "../../graphql/types/DataSourceType";

class BaseDataSourceDialog extends Component {

    onClose() {
        this.clearForms();
        this.props.onClose();
    }

    onNameChange(name) {
        const nameValidation = name && name.length < 255 ? "success" : "error";

        const { validations } = this.state;
        const newValidations = { ...validations, name: nameValidation };

        this.setState({ name, validations: newValidations });
    }

    onTypeChange(type) {
        const typeValidation = type && type.length < 255 ? "success" : "error";

        const { validations } = this.state;
        const newValidations = { ...validations, type: typeValidation };

        this.setState({ type, validations: newValidations });
    }

    onInMemoryOptionsChange(options) {
        const { timestampData } = options;
        const optionsValidation = typeof timestampData === "boolean"
            ? "success" : "error";

        const { validations } = this.state;
        const newValidations = { ...validations, optionsValidation };

        this.setState({ options, validations: newValidations });
    }

    renderSpecificOptionsFormsForSelectedType() {
        const { type, options } = this.state;

        switch (type) {
            case DataSourceType.InMemory:
                return (
                    <InMemoryOptions
                        isDisabled={this.isDisabled}
                        options={options}
                        onOptionsChange={newOps => this.onInMemoryOptionsChange(newOps)}
                    />
                );
            default:
                return null;
        }
    }

    /**
     * Abstract methods
     */
    getTitle() {
        throw new Error(`getTitle() not implemented in ${this.constructor.name}`);
    }

    onSubmit() {
        throw new Error(`onSubmit() not implemented in ${this.constructor.name}`);
    }

    clearForms() {
        throw new Error(`clearForms() not implemented in ${this.constructor.name}`);
    }

    isDisabled() {
        throw new Error(`isDisabled(controlId: string) not implemented in ${this.constructor.name}`);
    }

    render() {
        const { visible } = this.props;
        const { name, type, err, validations } = this.state;
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
                        <FormGroup controlId="type">
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
                                            {/* More Data Source Types to be added */}
                                        </DropdownButton>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </FormGroup>

                        {/* Specific forms depending on Data Source Type */}
                        {this.renderSpecificOptionsFormsForSelectedType()}

                    </Form>
                </Modal.Body>

                <Modal.Footer>
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
                        Edit
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default BaseDataSourceDialog;