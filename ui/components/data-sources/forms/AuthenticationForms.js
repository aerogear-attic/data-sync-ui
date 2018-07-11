import React from "react";
import {
    FormControl, FormGroup, Col
} from "patternfly-react";

const AuthenticationForms = ({
    username = "",
    password = "",
    onUsernameChange,
    onPasswordChange
}) => (
    <React.Fragment>
        {/* Username */}
        <FormGroup controlId="username">
            <Col sm={3}>Username</Col>
            <Col sm={9}>
                <FormControl
                    type="text"
                    value={username}
                    onChange={e => onUsernameChange(e.target.value)}
                />
            </Col>
        </FormGroup>

        {/* Password */}
        <FormGroup controlId="password">
            <Col sm={3}>Password</Col>
            <Col sm={9}>
                <FormControl
                    type="password"
                    value={password}
                    onChange={e => onPasswordChange(e.target.value)}
                />
            </Col>
        </FormGroup>
    </React.Fragment>
);

export { AuthenticationForms };
