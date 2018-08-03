import React from "react";
import {
    Form,
    Row,
    Col,
    FormGroup,
    InputGroup,
    FormControl,
    DropdownButton,
    MenuItem
} from "patternfly-react";

import styles from "./Security.css";

const Security = () => (
    <div className={styles.resolverSecurity}>
        <div className={styles.resolverHeader}>
            <span>Security</span>
        </div>
        <Form horizontal className={styles.resolverDetailsArea}>
            <Row>
                <Col sm={4}>Add a Keycloak role to this object</Col>
            </Row>
            <FormGroup controlId="role">
                <Col sm={10} style={{ width: "350px" }}>
                    <InputGroup>
                        <FormControl
                            disabled
                            style={{ backgroundColor: "#fff", color: "#363636" }}
                            value="AppDeveloper"
                        />
                        <InputGroup.Button>
                            <DropdownButton
                                disabled={false}
                                bsStyle="default"
                                id="dropdown-type"
                                title=""
                                onSelect={() => {
                                    console.log("on select called");
                                }}
                            >
                                <MenuItem>
                                  AppDeveloper
                                </MenuItem>
                            </DropdownButton>
                        </InputGroup.Button>
                    </InputGroup>
                </Col>
            </FormGroup>
        </Form>
    </div>
);

export { Security };
