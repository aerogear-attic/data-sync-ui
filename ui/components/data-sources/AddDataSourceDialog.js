import React, { Component } from "react";
import { Modal, Icon } from "patternfly-react";

class AddDataSourceDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        const { visible, onClose, text } = this.props;
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
                    <Modal.Title>{text}</Modal.Title>
                </Modal.Header>
            </Modal>
        );
    }

}

export { AddDataSourceDialog };
