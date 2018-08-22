import React from "react";
import { mount } from "enzyme";

import { MockedProvider } from "react-apollo/test-utils";
import { MenuItem } from "patternfly-react";
import { SubscriptionsDropDown } from "../../../ui/components/resolvers";
import { sleep } from "../../utils";

import GetSubscriptions from "../../../ui/graphql/GetSubscriptions.graphql";

let wrapper;
let dropdown;

function getWrapper(subscriptions) {
    const mocks = [{
        request: {
            query: GetSubscriptions
        },
        result: {
            data: { subscriptions }
        }
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
    beforeEach(() => {
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
        { field: "users", type: "Query", topic: "test", filter: "test" },
        { field: "addUser", type: "Mutation", topic: "test", filter: "test" }
    ];

    beforeEach(async () => {
        wrapper = getWrapper(subscriptions);
        await sleep(0);
        wrapper.update();
        dropdown = wrapper.find(SubscriptionsDropDown).first();
    });

    it("should display dropdown with the subscriptions", () => {
        expect(dropdown.find("FormControlStatic").exists()).toBe(false);
        expect(dropdown.find("DropdownButton").exists()).toBe(true);
    });

    it("should have an empty option", () => {
        expect(dropdown.containsMatchingElement(
            <MenuItem key="empty_subscription" eventKey={undefined} />
        )).toBe(true);
    });

    it("should have an option for each subscription", () => {
        expect(dropdown.find(MenuItem)).toHaveLength(subscriptions.length + 1);
    });
});
