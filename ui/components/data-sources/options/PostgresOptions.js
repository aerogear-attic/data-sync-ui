import React from "react";
import {
    Col,
    FormGroup,
    FormControl
} from "patternfly-react";

const PostgresOptions = ({ options, onOptionsChange, isDisabled }) => (
    <React.Fragment>
        {/* TimeStamp Data Option */}
        <FormGroup controlId="url">
            <Col sm={3}>Server</Col>
            <Col sm={9}>
                <FormControl
                    disabled={isDisabled("url")}
                    type="text"
                    value={options.url}
                    onChange={e => onOptionsChange({
                        ...options,
                        url: e.target.value
                    })}
                />
            </Col>
        </FormGroup>
        <FormGroup controlId="port">
            <Col sm={3}>Port</Col>
            <Col sm={9}>
                <FormControl
                    disabled={isDisabled("port")}
                    type="text"
                    value={options.port}
                    onChange={e => onOptionsChange({
                        ...options,
                        port: e.target.value
                    })}
                />
            </Col>
        </FormGroup>
        <FormGroup controlId="database">
            <Col sm={3}>Database</Col>
            <Col sm={9}>
                <FormControl
                    disabled={isDisabled("database")}
                    type="text"
                    value={options.database}
                    onChange={e => onOptionsChange({
                        ...options,
                        database: e.target.value
                    })}
                />
            </Col>
        </FormGroup>
        <FormGroup controlId="username">
            <Col sm={3}>Username</Col>
            <Col sm={9}>
                <FormControl
                    disabled={isDisabled("username")}
                    type="text"
                    value={options.username}
                    onChange={e => onOptionsChange({
                        ...options,
                        username: e.target.value
                    })}
                />
            </Col>
        </FormGroup>
        <FormGroup controlId="password">
            <Col sm={3}>Password</Col>
            <Col sm={9}>
                <FormControl
                    disabled={isDisabled("password")}
                    type="password"
                    value={options.password}
                    onChange={e => onOptionsChange({
                        ...options,
                        password: e.target.value
                    })}
                />
            </Col>
        </FormGroup>
    </React.Fragment>
);

export { PostgresOptions };
