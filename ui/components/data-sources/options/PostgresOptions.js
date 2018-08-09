import React, { Component } from "react";
import {
    Col,
    FormGroup,
    FormControl
} from "patternfly-react";

import { Validate, Validators } from "../../../helper/Validators";

const INITIAL_STATE = {
    urlValidation: "null",
    portValidation: "success",
    databaseValidation: "null",
    usernameValidation: "null",
    passwordValidation: "success"
};

class PostgresOptions extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    onHostChange(host) {
        const urlValidation = Validate([
            Validators.String.nonBlank, host
        ]);

        this.setState({ urlValidation });
        this.props.onOptionsChange({ ...this.props.options, host });
    }

    onPortChange(port) {
        const portValidation = Validate([
            Validators.Port.valid, port
        ]);

        this.setState({ portValidation });

        this.props.onOptionsChange({ ...this.props.options, port });
    }

    onDatabaseChange(database) {
        const databaseValidation = Validate([
            Validators.String.nonBlank, database
        ]);

        this.setState({ databaseValidation });

        this.props.onOptionsChange({ ...this.props.options, database });
    }

    onUsernameChange(user) {
        const usernameValidation = Validate([
            Validators.String.nonBlank, user
        ]);

        this.setState({ usernameValidation });

        this.props.onOptionsChange({ ...this.props.options, user });
    }

    onPasswordChange(password) {
        const passwordValidation = Validate([
            Validators.Password.valid, password
        ]);

        this.setState({ passwordValidation });

        this.props.onOptionsChange({ ...this.props.options, password });
    }

    render() {
        const { options, isDisabled } = this.props;
        const { urlValidation, portValidation, databaseValidation, usernameValidation, passwordValidation } = this.state;

        return (
            <React.Fragment>
                <FormGroup controlId="host" validationState={urlValidation}>
                    <Col sm={3}>Host</Col>
                    <Col sm={9}>
                        <FormControl
                            disabled={isDisabled("host")}
                            type="text"
                            value={options.host}
                            onChange={e => this.onHostChange(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup controlId="port" validationState={portValidation}>
                    <Col sm={3}>Port</Col>
                    <Col sm={9}>
                        <FormControl
                            disabled={isDisabled("port")}
                            type="number"
                            value={options.port}
                            onChange={e => this.onPortChange(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup controlId="database" validationState={databaseValidation}>
                    <Col sm={3}>Database</Col>
                    <Col sm={9}>
                        <FormControl
                            disabled={isDisabled("database")}
                            type="text"
                            value={options.database}
                            onChange={e => this.onDatabaseChange(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup controlId="username" validationState={usernameValidation}>
                    <Col sm={3}>Username</Col>
                    <Col sm={9}>
                        <FormControl
                            disabled={isDisabled("user")}
                            type="text"
                            value={options.user}
                            onChange={e => this.onUsernameChange(e.target.value)}
                        />
                    </Col>
                </FormGroup>
                <FormGroup controlId="password" validationState={passwordValidation}>
                    <Col sm={3}>Password</Col>
                    <Col sm={9}>
                        <FormControl
                            disabled={isDisabled("password")}
                            type="password"
                            value={options.password}
                            onChange={e => this.onPasswordChange(e.target.value)}
                        />
                    </Col>
                </FormGroup>
            </React.Fragment>
        );
    }

}

export { PostgresOptions };
