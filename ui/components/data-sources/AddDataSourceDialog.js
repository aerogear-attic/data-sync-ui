import React, { Component } from "react";
import {
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

const TITLE = "Create new Data Source";

class AddDataSourceDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { visible, onClose } = this.props;

        return (
            <Modal show={visible}>
                <Modal.Header>
                    <button
                        className="close"
                        aria-hidden="true"
                        onClick={onClose}
                        aria-label="Close"
                        type="submit"
                    >
                        <Icon type="pf" name="close" />
                    </button>
                    <Modal.Title>{TITLE}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form horizontal>
                        {/* Data Source Name */}
                        <FormGroup controlId="name">
                            <Col sm={3}>
                                Data Source Name
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" />
                            </Col>
                        </FormGroup>

                        {/* Data Source Type */}
                        <FormGroup controlId="type">
                            <Col sm={3}>
                                Data Source Name
                            </Col>
                            <Col sm={9}>
                                <InputGroup>
                                    <FormControl disabled style={{ backgroundColor: "#fff" }} />
                                    <InputGroup.Button>
                                        <DropdownButton bsStyle="default" id="dropdown-type" title="">
                                            <MenuItem eventKey="1">PostgreSQL</MenuItem>
                                            <MenuItem eventKey="2">SQLite</MenuItem>
                                        </DropdownButton>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </FormGroup>

                        {/* Username */}
                        <FormGroup controlId="username">
                            <Col sm={3}>
                                Username
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" />
                            </Col>
                        </FormGroup>

                        {/* Password */}
                        <FormGroup controlId="password">
                            <Col sm={3}>
                                Password
                            </Col>
                            <Col sm={9}>
                                <FormControl type="password" />
                            </Col>
                        </FormGroup>

                        {/* Database */}
                        <FormGroup controlId="database">
                            <Col sm={3}>
                                Database
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" />
                            </Col>
                        </FormGroup>

                        {/* Hostname */}
                        <FormGroup controlId="hostname">
                            <Col sm={3}>
                                Hostname
                            </Col>
                            <Col sm={9}>
                                <FormControl type="text" />
                            </Col>
                        </FormGroup>

                        {/* Port */}
                        <FormGroup controlId="port">
                            <Col sm={3}>
                                Port
                            </Col>
                            <Col sm={9}>
                                <FormControl type="number" />
                            </Col>
                        </FormGroup>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        bsStyle="default"
                        className="btn-cancel"
                        onClick={this.close}
                    >
                        Cancel
                    </Button>
                    <Button bsStyle="primary" onClick={() => this.onSaveClick()}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export { AddDataSourceDialog };
