import React from "react";
import {
    Col,
    FormControl,
    InputGroup,
    Button
} from "patternfly-react";

const HookFormGroup = ({ url = "", label, onChange }) => {
    const testHook = () => {
        console.log(`Test url: ${url}`);
    };

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
                        <Button onClick={testHook}>
                            Verify URL
                        </Button>
                    </InputGroup.Button>
                </InputGroup>
            </Col>
        </React.Fragment>
    );
};

export { HookFormGroup };
