import React from "react";
import {
    FormGroup,
    Col,
    InputGroup,
    MenuItem,
    SplitButton
} from "patternfly-react";

import styles from "./RequestMappingTemplate.css";

const RequestMappingTemplate = ({ onSelect }) => (
    <FormGroup controlId="">
        <Col sm={9} className={styles.requestMappingControlLabel}>Request Mapping Template</Col>
        <Col sm={3}>
            <InputGroup className="pull-right">
                <SplitButton
                    pullRight
                    bsStyle="default"
                    id="dropdown-type"
                    title="Custom"
                    className={styles.requestMappingDropDown}
                    onClick={() => onSelect()}
                    onSelect={() => {}}
                >
                    <MenuItem eventKey="custom">Custom</MenuItem>
                </SplitButton>
            </InputGroup>
        </Col>
    </FormGroup>
);

export { RequestMappingTemplate };
