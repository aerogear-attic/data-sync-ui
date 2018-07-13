import React from "react";
import {
    FormControl, FormGroup, Col
} from "patternfly-react";

const DBOptions = ({
    database = "",
    hostname = "",
    port = "",
    onDatabaseChange,
    onHostnameChange,
    onPortChange
}) => (
    <React.Fragment>
        {/* Database */}
        <FormGroup controlId="database">
            <Col sm={3}>Database</Col>
            <Col sm={9}>
                <FormControl
                    type="text"
                    value={database}
                    onChange={e => onDatabaseChange(e.target.value)}
                />
            </Col>
        </FormGroup>

        {/* Hostname */}
        <FormGroup controlId="hostname">
            <Col sm={3}>Hostname</Col>
            <Col sm={9}>
                <FormControl
                    type="text"
                    value={hostname}
                    onChange={e => onHostnameChange(e.target.value)}
                />
            </Col>
        </FormGroup>

        {/* Port */}
        <FormGroup controlId="port">
            <Col sm={3}>Port</Col>
            <Col sm={9}>
                <FormControl
                    type="text"
                    value={port}
                    onChange={e => onPortChange(e.target.value)}
                />
            </Col>
        </FormGroup>
    </React.Fragment>
);

export { DBOptions };
