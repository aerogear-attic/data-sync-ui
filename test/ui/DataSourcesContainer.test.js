import React from "react";
import { render } from "enzyme";

import { MockedProvider } from "react-apollo/test-utils";
import { DataSourcesContainer } from "../../ui/components/data-sources";

let wrapper;

beforeEach(() => {
    wrapper = render(
        <MockedProvider>
            <DataSourcesContainer />
        </MockedProvider>
    );
});

describe("Toolbar", () => {
    it("should feature a button for adding new data sources", () => {
        expect(wrapper.find("button").text()).toEqual("Add Data Source");
    });
});
