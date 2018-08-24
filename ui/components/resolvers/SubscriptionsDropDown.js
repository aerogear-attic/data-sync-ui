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

const SubscriptionsDropDown = ({ selected, onSubscriptionSelect }) => {
    const renderDropdown = subscriptions => {
        const options = [
            <MenuItem key="empty_subscription" eventKey={undefined}>None</MenuItem>,
            ...subscriptions.map(s => (
                <MenuItem key={s.field} eventKey={s}>
                    {`${s.field} (${s.type})`}
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
    };

    return (
        <React.Fragment>
            <Col sm={2} className={controlLabel}>Subscription</Col>
            <Col sm={6}>
                <Query query={GetSchema} variables={{ name: "default" }}>
                    {({ loading, error, data }) => {
                        if (loading || typeof error !== "undefined") {
                            return <FormControl.Static>Loading subscriptions...</FormControl.Static>;
                        }

                        const { getSchema: { compiled } } = data;
                        const schema = JSON.parse(compiled);
                        const { types } = schema.data.__schema;
                        const subscriptions = types.filter(n => n.name === "Subscription");
                        console.log("subscriptions: ", subscriptions);

                        if (!subscriptions.length) {
                            return <FormControl.Static>Please first create a subscription</FormControl.Static>;
                        }

                        return renderDropdown(subscriptions);
                    }}
                </Query>
            </Col>
        </React.Fragment>
    );
};

export { SubscriptionsDropDown };
