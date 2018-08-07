import React from "react";
import { mount } from "enzyme";

import { MockedProvider } from "react-apollo/test-utils";
import { ResolverDetail, HookFormGroup } from "../../../ui/components/resolvers";

let wrapper;

afterEach(() => {
    wrapper = null;
});

describe("When resolver is undefined", () => {
    beforeEach(() => {
        wrapper = mount(
            <MockedProvider mocks={[]} addTypename={false}>
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

    const getWrapper = r => mount(
        <MockedProvider mocks={[]} addTypename={false}>
            <ResolverDetail resolver={r} />
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

    it("should disable preHook and postHook if type is Query", () => {
        wrapper = getWrapper({ ...resolver, type: "Query" }).find(ResolverDetail).first();
        expect(wrapper.find(HookFormGroup).everyWhere(n => n.prop("disabled"))).toBe(true);
    });

    it("should enable preHook and postHook if type is Mutation", () => {
        wrapper = getWrapper({ ...resolver, type: "Other" }).find(ResolverDetail).first();
        expect(wrapper.find(HookFormGroup).everyWhere(n => !n.prop("disabled"))).toBe(true);
    });
});
