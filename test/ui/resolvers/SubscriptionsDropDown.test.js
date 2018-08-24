import React from "react";
import { mount } from "enzyme";

import { MockedProvider } from "react-apollo/test-utils";
import { MenuItem } from "patternfly-react";
import { SubscriptionsDropDown } from "../../../ui/components/resolvers";
import { sleep } from "../../utils";

import GetSubscriptions from "../../../ui/graphql/GetSubscriptions.graphql";

let wrapper;
let dropdown;

function getWrapper(subscriptions, error) {
    const mocks = [{
        request: {
            query: GetSubscriptions
        },
        result: {
            data: { subscriptions }
        },
        error
    }];

    return mount(
        <MockedProvider mocks={mocks} addTypename={false}>
            <SubscriptionsDropDown />
        </MockedProvider>
    );
}

afterEach(() => {
    wrapper = null;
});

describe("When there are no subscriptions", () => {
    beforeEach(async () => {
        wrapper = getWrapper([]);
        await sleep(0); // Wait for the query to finish
        wrapper.update();
        dropdown = wrapper.find(SubscriptionsDropDown).first();
    });

    it("should display a warning message instead of a dropdown", () => {
        expect(dropdown.find("DropdownButton").exists()).toBe(false);
        expect(dropdown.find("FormControlStatic").exists()).toBe(true);
        expect(dropdown.find("FormControlStatic").text()).toEqual("Please first create a subscription");
    });
});

describe("When query is loading", () => {
    beforeEach(async () => {
        wrapper = getWrapper([]);
        dropdown = wrapper.find(SubscriptionsDropDown).first();
    });

    it("should display a loading message", () => {
        expect(dropdown.find("DropdownButton").exists()).toBe(false);
        expect(dropdown.find("FormControlStatic").exists()).toBe(true);
        expect(dropdown.find("FormControlStatic").text()).toEqual("Loading subscriptions...");
    });
});

describe("When query returns an error", () => {
    beforeEach(async () => {
        wrapper = getWrapper([], new Error("Something failed!"));
        await sleep(0); // Wait for the query to finish
        wrapper.update();
        dropdown = wrapper.find(SubscriptionsDropDown).first();
    });

    it("should display an error message", () => {
        expect(dropdown.find("DropdownButton").exists()).toBe(false);
        expect(dropdown.find("FormControlStatic").exists()).toBe(true);
        expect(dropdown.find("FormControlStatic").text()).toEqual("Loading subscriptions...");
    });
});

describe("When there are subscriptions", () => {
    const subscriptions = [
        { field: "users", type: "Subscription", topic: "test", filter: "" },
        { field: "addUser", type: "Subscription", topic: "test", filter: "" }
    ];

    beforeEach(async () => {
        wrapper = getWrapper(subscriptions);
        await sleep(0); // Wait for the query to finish
        wrapper.update();
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
