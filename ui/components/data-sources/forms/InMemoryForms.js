import React from "react";
import {
    FormControl, FormGroup, Col
} from "patternfly-react";

const InMemoryForms = ({ collection = "", onCollectionChange }) => (
    <React.Fragment>
        {/* Collection */}
        <FormGroup controlId="collection">
            <Col sm={3}>Collection</Col>
            <Col sm={9}>
                <FormControl
                    type="text"
                    value={collection}
                    onChange={e => onCollectionChange(e.target.value)}
                />
            </Col>
        </FormGroup>
    </React.Fragment>
);

export { InMemoryForms };
