import React from "react";
import {
    Col,
    InputGroup,
    MenuItem,
    SplitButton
} from "patternfly-react";

import styles from "./mappingTemplateDropDown.css";

// TODO: rename "value" and "onSelect" properly
const ResponseMappingTemplateDropDown = ({ value, onSelect }) => (
    <React.Fragment>
        <Col sm={9} className={styles.mappingControlLabel}>Response Mapping Template</Col>
        <Col sm={3} className="pull-right">
            <InputGroup className="pull-right">
                <SplitButton
                    pullRight
                    bsStyle="default"
                    id="dropdown-type"
                    title={value}
                    className={styles.mappingDropDown}
                    onSelect={eventKey => onSelect(eventKey)}
                >
                    <MenuItem eventKey="Custom">Custom</MenuItem>
                </SplitButton>
            </InputGroup>
        </Col>
    </React.Fragment>
);

export { ResponseMappingTemplateDropDown };
