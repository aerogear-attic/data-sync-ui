import React from "react";
import { mount } from "enzyme";
import { MockedProvider } from "react-apollo/test-utils";
import { sleep } from "../../utils";

import { DataSourcesList } from "../../../ui/components/data-sources";

import GetDataSources from "../../../ui/graphql/GetDataSources.graphql";

let wrapper;
let list;

function getWrapper(dataSources, filter = {}, error) {
    const mocks = [{
        request: {
            query: GetDataSources,
            variables: filter
        },
        result: {
            data: { dataSources }
        },
        error
    }];

    return mount(
        <MockedProvider mocks={mocks} addTypename={false}>
            <DataSourcesList filter={filter} />
        </MockedProvider>
    );
}

describe("When there is no data sources", () => {
    beforeEach(async () => {
        wrapper = getWrapper([]);
        await sleep(0); // Wait for the query to finish
        wrapper.update();
        list = wrapper.find(DataSourcesList).first();
    });

    it("should render an empty view that prompts to create one", () => {
        expect(list.find("ListView").exists()).toBe(false);
        expect(list.find("EmptyState").exists()).toBe(true);
        expect(list.find("EmptyStateTitle").text()).toEqual("No Data Sources defined");
        expect(list.find("EmptyStateAction").text()).toEqual("Add a Data Source");
    });
});

describe("When there are data sources", () => {
    const dataSources = [
        { id: 0, name: "pepe", type: "InMemory", config: "", resolvers: [] },
        { id: 1, name: "foo", type: "InMemory", config: "", resolvers: [] }
    ];

    it("should render a list with an item for each one", async () => {
        wrapper = getWrapper(dataSources);
        await sleep(0); // Wait for the query to finish
        wrapper.update();
        list = wrapper.find(DataSourcesList).first();

        expect(list.find("ListView").exists()).toBe(true);
        expect(list.find("EmptyState").exists()).toBe(false);
        expect(list.find("DataSourcesListItem")).toHaveLength(dataSources.length);
    });

    it("should render an empty view if filter has no results", async () => {
        wrapper = getWrapper([], { name: "test" });
        await sleep(0); // Wait for the query to finish
        wrapper.update();
        list = wrapper.find(DataSourcesList).first();

        expect(list.find("ListView").exists()).toBe(false);
        expect(list.find("EmptyState").exists()).toBe(true);
        expect(list.find("EmptyStateTitle").text()).toEqual("No item found while filtering the data sources");
        expect(list.find("EmptyStateAction").text()).toEqual("Clear the filter");
    });
});
