import React, { Component } from "react";
import {
    Col,
    FormControl,
    InputGroup,
    Button,
    Icon
} from "patternfly-react";

import { verifyButton, verifyButtonLabel } from "./HookFormGroup.css";

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
        // TODO: implement verification with server
        const { url = "" } = this.props;
        console.log("Verifying url...", url);

        this.setState({ verifyingUrl: true, verificationResult: null });

        setTimeout(() => this.setState({ verifyingUrl: false, verificationResult: "error" }), 1000);
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
                <Col sm={3}>{label}</Col>
                <Col sm={9}>
                    <InputGroup>
                        <FormControl
                            disabled={disabled}
                            type="url"
                            value={url}
                            onChange={ev => onChange(ev.currentTarget.value)}
                            placeholder="https://example.com/yourhook"
                        />
                        <InputGroup.Button>
                            <Button
                                disabled={disabled}
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
