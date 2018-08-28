import React from "react";
import { Query } from "react-apollo";
import {
    MenuItem,
    InputGroup,
    FormControl,
    DropdownButton,
    Col
} from "patternfly-react";

import GetSchema from "../../graphql/GetSchema.graphql";

import { controlLabel, formControl } from "./SubscriptionsDropDown.css";

const SubscriptionsDropDown = ({ selected = null, onSubscriptionSelect }) => (
    <React.Fragment>
        <Col sm={2} className={controlLabel}>Subscription</Col>
        <Col sm={6}>
            <Query query={GetSchema} variables={{ name: "default" }}>
                {({ loading, error, data }) => {
                    if (loading || typeof error !== "undefined") {
                        return <FormControl.Static>Loading subscriptions...</FormControl.Static>;
                    }

                    const { getSchema: { compiled } } = data;
                    const { types } = JSON.parse(compiled).data.__schema;
                    const subscriptions = types.find(n => n.name === "Subscription");

                    if (!subscriptions || !subscriptions.fields) {
                        return <FormControl.Static>Please first create a subscription</FormControl.Static>;
                    }

                    const options = [
                        <MenuItem key="empty_subscription" eventKey={null}>None</MenuItem>,
                        ...subscriptions.fields.map(({ name }) => (
                            <MenuItem key={name} eventKey={name}>
                                {name}
                            </MenuItem>
                        ))
                    ];

                    const value = selected === null ? "" : selected;

                    return (
                        <InputGroup>
                            <FormControl
                                disabled
                                className={formControl}
                                value={value}
                                placeholder="None"
                            />
                            <InputGroup.Button>
                                <DropdownButton
                                    bsStyle="default"
                                    id="dropdown-type"
                                    title=""
                                    onSelect={s => onSubscriptionSelect(s)}
                                >
                                    {options}
                                </DropdownButton>
                            </InputGroup.Button>
                        </InputGroup>
                    );
                }}
            </Query>
        </Col>
    </React.Fragment>
);

export { SubscriptionsDropDown };
