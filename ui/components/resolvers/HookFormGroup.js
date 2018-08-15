import React, { Component } from "react";
import axios from "axios";
import {
    Col,
    FormControl,
    InputGroup,
    Button,
    Icon
} from "patternfly-react";
import { Validate, Validators } from "../../helper/Validators";

import {
    verifyButton, verifyButtonLabel, hookControlLabel
} from "./HookFormGroup.css";

const INITIAL_STATE = {
    verifyingUrl: false,
    verificationResult: null
};

class HookFormGroup extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    testHook() {
        const { url = "" } = this.props;
        this.setState({ verifyingUrl: true, verificationResult: null });

        if (Validate([Validators.URL.valid, url]) !== "success") {
            this.setState({ verifyingUrl: false, verificationResult: "error" });
            return;
        }
        const testHookRoute = "/testHook";
        axios.post(testHookRoute, { hook: url })
            .then(res => {
                const verificationResult = res.statusText === "OK" ? "success" : "error";
                this.setState({ verifyingUrl: false, verificationResult });
            })
            .catch(() => {
                this.setState({ verifyingUrl: false, verificationResult: "error" });
            });
    }

    renderVerificationIcon() {
        const { verifyingUrl, verificationResult } = this.state;

        if (verifyingUrl) {
            return <Icon name="spinner" spin />;
        }

        if (verificationResult === "success") {
            return <Icon type="pf" name="ok" />;
        }

        if (verificationResult === "error") {
            return <Icon type="pf" name="error-circle-o" />;
        }

        return null;
    }

    render() {
        const { url = "", label, onChange, disabled = false } = this.props;
        const { verifyingUrl } = this.state;

        return (
            <React.Fragment>
                <Col sm={3} className={hookControlLabel}>{label}</Col>
                <Col sm={9}>
                    <InputGroup>
                        <FormControl
                            disabled={disabled || verifyingUrl}
                            type="url"
                            value={url}
                            onChange={ev => onChange(ev.currentTarget.value)}
                            placeholder="https://example.com/yourhook"
                        />
                        <InputGroup.Button>
                            <Button
                                disabled={disabled || verifyingUrl}
                                onClick={() => this.testHook()}
                                className={verifyButton}
                            >
                                <span className={verifyButtonLabel}>{verifyingUrl ? "Verifying..." : "Verify URL"}</span>
                                {this.renderVerificationIcon()}
                            </Button>
                        </InputGroup.Button>
                    </InputGroup>
                </Col>
            </React.Fragment>
        );
    }

}

export { HookFormGroup };
