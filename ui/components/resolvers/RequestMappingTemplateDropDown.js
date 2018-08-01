import React from "react";
import {
    FormGroup,
    Col,
    InputGroup,
    MenuItem,
    SplitButton
} from "patternfly-react";

import styles from "./RequestMappingTemplateDropDown.css";

// TODO: rename "value" and "onSelect" properly
const RequestMappingTemplateDropDown = ({ value, onSelect }) => (
    <FormGroup controlId="">
        <Col sm={9} className={styles.requestMappingControlLabel}>Request Mapping Template</Col>
        <Col sm={3}>
            <InputGroup className="pull-right">
                <SplitButton
                    pullRight
                    bsStyle="default"
                    id="dropdown-type"
                    title={value}
                    className={styles.requestMappingDropDown}
                    onSelect={eventKey => onSelect(eventKey)}
                >
                    <MenuItem eventKey="Custom">Custom</MenuItem>
                </SplitButton>
            </InputGroup>
        </Col>
    </FormGroup>
);

export { RequestMappingTemplateDropDown };
