import React from "react";
import {
    Col,
    FormGroup,
    Checkbox
} from "patternfly-react";

const InMemoryForms = ({ values, onValuesChange }) => (
    <React.Fragment>
        {/* TimeStamp Data Option */}
        <FormGroup controlId="checkbox">
            <Col sm={3}>TimeStamp Data</Col>
            <Col sm={9}>
                <Checkbox
                    checked={values.timestampData}
                    onClick={e => onValuesChange({ timestampData: e.target.checked })}
                />
            </Col>
        </FormGroup>
    </React.Fragment>
);

export { InMemoryForms };
