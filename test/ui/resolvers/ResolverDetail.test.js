import React from "react";
import { mount } from "enzyme";

import { MockedProvider } from "react-apollo/test-utils";
import { ResolverDetail, HookFormGroup } from "../../../ui/components/resolvers";

import GetDataSources from "../../../ui/graphql/GetDataSources.graphql";

let wrapper;

const mocks = [{
    request: {
        query: GetDataSources
    },
    result: {
        data: {
            resolvers: []
        }
    }
}];

afterEach(() => {
    wrapper = null;
});

describe("When resolver is undefined", () => {
    beforeEach(() => {
        wrapper = mount(
            <MockedProvider mocks={mocks} addTypename={false}>
                <ResolverDetail />
            </MockedProvider>
        );
    });

    it("should render an empty state", () => {
        const detail = wrapper.find(ResolverDetail).first();

        expect(detail.find("EmptyState")).toHaveLength(1);
        expect(detail.find("Form")).toHaveLength(0);
    });
});

describe("When resolver is defined", () => {
    const resolver = {
        field: "test",
        type: "Query",
        DataSource: {},
        requestMapping: "",
        responseMapping: "",
        preHook: "",
        postHook: ""
    };

    const getWrapper = (r, props) => mount(
        <MockedProvider mocks={mocks} addTypename={false}>
            <ResolverDetail resolver={r} {...props} />
        </MockedProvider>
    );

    it("should render a form", () => {
        wrapper = getWrapper(resolver).find(ResolverDetail).first();

        expect(wrapper.prop("resolver")).toBe(resolver);
        expect(wrapper.find("EmptyState")).toHaveLength(0);
        expect(wrapper.find("Form")).toHaveLength(1);
    });

    it("should render a preHook and a postHook", () => {
        wrapper = getWrapper({ resolver }).find(ResolverDetail).first();
        expect(wrapper.find(HookFormGroup)).toHaveLength(2);
    });

    it("should have preHook and postHook enabled by default", () => {
        wrapper = getWrapper({ ...resolver, type: "Other" }).find(ResolverDetail).first();
        expect(wrapper.find(HookFormGroup).everyWhere(n => !n.prop("disabled"))).toBe(true);
    });

    it("should render a subscriptions form", () => {
        wrapper = getWrapper(resolver).find(ResolverDetail).first();
        expect(wrapper.find("SubscriptionsDropDown")).toHaveLength(1);
    });

    it("should display a disabled 'save' button by default", () => {
        wrapper = getWrapper(resolver).find(ResolverDetail).first();
        expect(wrapper.containsMatchingElement(
            <button disabled>Save</button>
        )).toBe(true);
    });

    it.skip("should enable the save button after making any valid change", () => {
        // FIXME: Enzyme does not support changes in children nodes state, and ResolverDetail
        // has to be wrapped in a MockedProvider for Apollo to work. This test should be present
        // though

        // wrapper = getWrapper(resolver, { onResolverEdit: () => {} });

        // wrapper.find("input").first().simulate("change", { target: { value: "http://example.hook" } });
        // wrapper.update();

        // expect(wrapper.containsMatchingElement(
        //     <button disabled={false}>Save</button>
        // )).toBe(true);
    });

    it.skip("should keep the save button disabled in any invalid change is made", () => {
    });
});
