import React from "react";
import { Modal, Icon } from "patternfly-react";

const DataSourceDialog = ({ visible, onClose, text }) => (
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

export default DataSourceDialog;
