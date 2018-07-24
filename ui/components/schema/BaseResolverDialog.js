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
import { CodeEditor } from "../common/CodeEditor";

class BaseResolverDialog extends Component {

    onClose() {
        this.clearForms();
        this.props.onClose();
    }

    onDataSourceChange(dataSourceName) {
        console.log("called onDataSourceChange, ", dataSourceName);
    }

    onRequestMappingChange(requestMapping) {
        console.log("called onRequestMappingChange, ", requestMapping);
    }

    onResponseMappingChange(responseMapping) {
        console.log("called onResponseMapping, ", responseMapping);
    }

    renderDataSources() {
        return (
            <MenuItem eventKey={() => {}}>
                TestMenu Item
            </MenuItem>);
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

    render() {
        const { visible } = this.props;
        const { dataSourceName, responseMapping, requestMapping, err, validations } = this.state;
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

                        <FormGroup controlId="dataSource" validationState={validations.dataSourceName}>
                            <Col sm={3}>Data Source</Col>
                            <Col sm={9}>
                                <InputGroup>
                                    <FormControl
                                        disabled
                                        style={{ backgroundColor: "#fff", color: "#363636" }}
                                        value={dataSourceName}
                                    />
                                    <InputGroup.Button>
                                        <DropdownButton
                                            disabled={this.isDisabled("dataSourceName")}
                                            bsStyle="default"
                                            id="dropdown-type"
                                            title=""
                                            onSelect={ds => this.onDataSourceChange(ds)}
                                        >
                                            {this.renderDataSources()}
                                        </DropdownButton>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </FormGroup>

                        {/* Resolver request mapping */}
                        <FormGroup controlId="requestMapping" validationState={validations.requestMapping}>
                            <Col sm={3}>Request Mapping</Col>
                            <Col sm={9}>
                                <div style={{
                                    height: "120px",
                                    border: "1px solid lightgrey"
                                }}
                                >
                                    <CodeEditor
                                        value={requestMapping}
                                        onChange={e => this.onRequestMappingChange(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </FormGroup>

                        {/* Resolver response mapping */}
                        <FormGroup controlId="responseMapping" validationState={validations.responseMapping}>
                            <Col sm={3}>Response Mapping</Col>
                            <Col sm={9}>
                                <div style={{
                                    height: "120px",
                                    border: "1px solid lightgrey"
                                }}
                                >
                                    <CodeEditor
                                        value={responseMapping}
                                        onChange={e => this.onResponseChanged(e.target.value)}
                                    />
                                </div>
                            </Col>
                        </FormGroup>
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
                        {this.getSubmitTitle()}
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export default BaseResolverDialog;
