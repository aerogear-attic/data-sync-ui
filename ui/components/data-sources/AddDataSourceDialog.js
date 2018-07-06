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

const TITLE = "Add Data Source";
const INITIAL_STATE = {
    name: "",
    type: "",
    username: "",
    password: "",
    database: "",
    hostname: "",
    port: ""
};

class AddDataSourceDialog extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    onClose() {
        this.setState(INITIAL_STATE);
        this.props.onClose();
    }

    render() {
        const { visible } = this.props;
        const { name, type, username, password, database, hostname, port } = this.state;

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
                    <Modal.Title>{TITLE}</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form horizontal>
                        {/* Data Source Name */}
                        <FormGroup controlId="name">
                            <Col sm={3}>Data Source Name</Col>
                            <Col sm={9}>
                                <FormControl
                                    type="text"
                                    value={name}
                                    onChange={e => this.setState({ name: e.target.value })}
                                />
                            </Col>
                        </FormGroup>

                        {/* Data Source Type */}
                        <FormGroup controlId="type">
                            <Col sm={3}>Data Source Name</Col>
                            <Col sm={9}>
                                <InputGroup>
                                    <FormControl
                                        disabled
                                        style={{ backgroundColor: "#fff", color: "#363636" }}
                                        value={type}
                                    />
                                    <InputGroup.Button>
                                        <DropdownButton
                                            bsStyle="default"
                                            id="dropdown-type"
                                            title=""
                                            onSelect={key => this.setState({ type: key })}
                                        >
                                            <MenuItem eventKey="PostgreSQL">PostgreSQL</MenuItem>
                                            <MenuItem eventKey="SQLite">SQLite</MenuItem>
                                        </DropdownButton>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </FormGroup>

                        {/* Username */}
                        <FormGroup controlId="username">
                            <Col sm={3}>Username</Col>
                            <Col sm={9}>
                                <FormControl
                                    type="text"
                                    value={username}
                                    onChange={e => this.setState({ username: e.target.value })}
                                />
                            </Col>
                        </FormGroup>

                        {/* Password */}
                        <FormGroup controlId="password">
                            <Col sm={3}>Password</Col>
                            <Col sm={9}>
                                <FormControl
                                    type="password"
                                    value={password}
                                    onChange={e => this.setState({ password: e.target.value })}
                                />
                            </Col>
                        </FormGroup>

                        {/* Database */}
                        <FormGroup controlId="database">
                            <Col sm={3}>Database</Col>
                            <Col sm={9}>
                                <FormControl
                                    type="text"
                                    value={database}
                                    onChange={e => this.setState({ database: e.target.value })}
                                />
                            </Col>
                        </FormGroup>

                        {/* Hostname */}
                        <FormGroup controlId="hostname">
                            <Col sm={3}>Hostname</Col>
                            <Col sm={9}>
                                <FormControl
                                    type="text"
                                    value={hostname}
                                    onChange={e => this.setState({ hostname: e.target.value })}
                                />
                            </Col>
                        </FormGroup>

                        {/* Port */}
                        <FormGroup controlId="port">
                            <Col sm={3}>Port</Col>
                            <Col sm={9}>
                                <FormControl
                                    type="text"
                                    value={port}
                                    onChange={e => this.setState({ port: e.target.value })}
                                />
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
                    <Button bsStyle="primary" onClick={() => this.onSaveClick()}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

}

export { AddDataSourceDialog };
