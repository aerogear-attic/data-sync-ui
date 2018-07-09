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
import { InMemoryForms } from "./forms";

import { DATA_SOURCE_IN_MEMORY } from "../model";

const TITLE = "Add Data Source";
const INITIAL_STATE = {
    name: "",
    type: DATA_SOURCE_IN_MEMORY
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

    onAdd() {
        // TODO: implement add datasource new logic here
    }

    renderDataSourceForms() {
        const { type, collection } = this.state;

        switch (type) {
        case DATA_SOURCE_IN_MEMORY:
            return (
                <InMemoryForms
                    collection={collection}
                    onCollectionChange={c => this.setState({ collection: c })}
                />
            );
        default:
            return null;
        }
    }

    render() {
        const { visible } = this.props;
        const { name, type } = this.state;

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
                                            <MenuItem eventKey={DATA_SOURCE_IN_MEMORY}>
                                                {DATA_SOURCE_IN_MEMORY}
                                            </MenuItem>
                                        </DropdownButton>
                                    </InputGroup.Button>
                                </InputGroup>
                            </Col>
                        </FormGroup>
                        {/* Specific forms depending on Data Source Type */}
                        {this.renderDataSourceForms()}
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
