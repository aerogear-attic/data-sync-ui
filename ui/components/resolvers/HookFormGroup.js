import React, { Component } from "react";
import {
    Col,
    FormControl
} from "patternfly-react";

import { hookControlLabel } from "./HookFormGroup.css";

const INITIAL_STATE = {
};

class HookFormGroup extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    render() {
        const { url = "", label, onChange, disabled = false } = this.props;

        return (
            <React.Fragment>
                <Col sm={2} className={hookControlLabel}>{label}</Col>
                <Col sm={6}>
                    <FormControl
                        disabled={disabled}
                        type="url"
                        value={url}
                        onChange={ev => onChange(ev.currentTarget.value)}
                        placeholder="https://example.com/yourhook"
                    />
                </Col>
            </React.Fragment>
        );
    }

}

export { HookFormGroup };
