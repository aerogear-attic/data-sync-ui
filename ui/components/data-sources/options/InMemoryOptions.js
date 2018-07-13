import React from "react";
import {
    Col,
    FormGroup,
    Checkbox
} from "patternfly-react";

const InMemoryOptions = ({ options, onOptionsChange, isDisabled }) => (
    <React.Fragment>
        {/* TimeStamp Data Option */}
        <FormGroup controlId="timestampData">
            <Col sm={3}>TimeStamp Data</Col>
            <Col sm={9}>
                <Checkbox
                    disabled={isDisabled("timestampData")}
                    checked={options.timestampData}
                    onChange={e => onOptionsChange({ timestampData: e.target.checked })}
                />
            </Col>
        </FormGroup>
    </React.Fragment>
);

export { InMemoryOptions };
