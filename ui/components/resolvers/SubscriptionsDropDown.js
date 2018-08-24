import React from "react";
import { Query } from "react-apollo";

import {
    MenuItem,
    InputGroup,
    FormControl,
    DropdownButton,
    Col
} from "patternfly-react";

import GetSubscriptions from "../../graphql/GetSubscriptions.graphql";

import { controlLabel, formControl } from "./SubscriptionsDropDown.css";

const SubscriptionsDropDown = ({ selected, onSubscriptionSelect }) => (
    <React.Fragment>
        <Col sm={2} className={controlLabel}>Subscription</Col>
        <Col sm={6}>
            <Query query={GetSubscriptions} variables={undefined}>
                {({ loading, error, data }) => {
                    if (loading || typeof error !== "undefined") {
                        return <FormControl.Static>Loading subscriptions...</FormControl.Static>;
                    }

                    if (!data || !data.subscriptions || !data.subscriptions.length) {
                        return <FormControl.Static>Please first create a subscription</FormControl.Static>;
                    }

                    const options = [
                        <MenuItem key="empty_subscription" eventKey={undefined}>None</MenuItem>,
                        ...data.subscriptions.map(subscription => (
                            <MenuItem key={subscription.field} eventKey={subscription}>
                                {`${subscription.field} (${subscription.type})`}
                            </MenuItem>
                        ))
                    ];

                    return (
                        <InputGroup>
                            <FormControl
                                disabled
                                className={formControl}
                                value={selected ? selected.type : ""}
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
