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
        <Col sm={3} className={controlLabel}>Subscription</Col>
        <Col sm={9}>
            <Query query={GetSubscriptions} variables={undefined}>
                {({ loading, error, data }) => {
                    if (!data || !data.subscriptions || !data.subscriptions.length) {
                        return <FormControl.Static>Please first create a subscription</FormControl.Static>;
                    }

                    const options = [
                        <MenuItem key="empty_subscription" eventKey={undefined} />,
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
                                placeholder="Subscription"
                            />
                            <InputGroup.Button>
                                <DropdownButton
                                    disabled={loading || error}
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