import React from "react";
import {
    MenuItem,
    InputGroup,
    FormControl,
    DropdownButton,
    Col
} from "patternfly-react";

import { controlLabel, formControl } from "./SubscriptionsDropDown.css";

const SubscriptionsDropDown = ({ selected, subscriptions = [], onSubscriptionSelect }) => {
    function renderDropdown() {
        if (!subscriptions.length) {
            return <FormControl.Static>Please first create a subscription</FormControl.Static>;
        }

        const options = [
            <MenuItem key="empty_subscription" eventKey={undefined}>None</MenuItem>,
            ...subscriptions.map(subscription => (
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
    }

    return (
        <React.Fragment>
            <Col sm={2} className={controlLabel}>Subscription</Col>
            <Col sm={6}>{renderDropdown()}</Col>
        </React.Fragment>
    );
};

export { SubscriptionsDropDown };
