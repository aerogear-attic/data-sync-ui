import React from "react";
import { shallow } from "enzyme";

import { MenuItem } from "patternfly-react";
import { SubscriptionsDropDown } from "../../../ui/components/resolvers";

let wrapper;
let dropdown;

function getWrapper(subscriptions) {
    return shallow(<SubscriptionsDropDown subscriptions={subscriptions} />);
}

afterEach(() => {
    wrapper = null;
});

describe("When there are no subscriptions", () => {
    beforeEach(async () => {
        wrapper = getWrapper([]);
        dropdown = wrapper.find(SubscriptionsDropDown).first();
    });

    it("should display a warning message instead of a dropdown", () => {
        expect(dropdown.find("DropdownButton").exists()).toBe(false);
        expect(dropdown.find("FormControlStatic").exists()).toBe(true);
        expect(dropdown.find("FormControlStatic").text()).toEqual("Please first create a subscription");
    });
});

describe("When there are subscriptions", () => {
    const subscriptions = [
        { field: "users", type: "Subscription", topic: "test", filter: "" },
        { field: "addUser", type: "Subscription", topic: "test", filter: "" }
    ];

    beforeEach(async () => {
        wrapper = getWrapper(subscriptions);
        dropdown = wrapper.find(SubscriptionsDropDown).first();
    });

    it("should display a dropdown with the subscriptions", () => {
        expect(dropdown.find("FormControlStatic").exists()).toBe(false);
        expect(dropdown.find("DropdownButton").exists()).toBe(true);
    });

    it("should display a dropdown with an empty option", () => {
        expect(dropdown.containsMatchingElement(
            <MenuItem key="empty_subscription" eventKey={undefined}>None</MenuItem>
        )).toBe(true);
    });

    it("should display a dropdown with an option for subscription", () => {
        expect(dropdown.find(MenuItem)).toHaveLength(subscriptions.length + 1);
    });
});
