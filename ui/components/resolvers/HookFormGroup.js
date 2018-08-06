import React, { Component } from "react";
import {
    Col,
    FormControl,
    InputGroup,
    Button
} from "patternfly-react";

class HookFormGroup extends Component {

    testHook() {
        const { url = "" } = this.props;
        console.log(`Test url: ${url}`);
    }

    render() {
        const { url = "", label, onChange } = this.props;

        return (
            <React.Fragment>
                <Col sm={3}>{label}</Col>
                <Col sm={9}>
                    <InputGroup>
                        <FormControl
                            type="url"
                            value={url}
                            onChange={ev => onChange(ev.currentTarget.value)}
                        />
                        <InputGroup.Button>
                            <Button onClick={() => this.testHook()}>
                            Verify URL
                            </Button>
                        </InputGroup.Button>
                    </InputGroup>
                </Col>
            </React.Fragment>
        );
    }
}

export { HookFormGroup };
