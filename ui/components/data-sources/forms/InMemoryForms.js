import React from "react";
import {
    Col,
    FormGroup,
    Checkbox
} from "patternfly-react";

const InMemoryForms = ({ values, onValuesChange, isDisabled }) => (
    <React.Fragment>
        {/* TimeStamp Data Option */}
        <FormGroup controlId="timestampData">
            <Col sm={3}>TimeStamp Data</Col>
            <Col sm={9}>
                <Checkbox
                    disabled={isDisabled("timestampData")}
                    checked={values.timestampData}
                    onChange={e => onValuesChange({ timestampData: e.target.checked })}
                />
            </Col>
        </FormGroup>
    </React.Fragment>
);

export { InMemoryForms };
