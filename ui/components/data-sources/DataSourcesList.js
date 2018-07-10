import React from "react";
import { Query } from "react-apollo";
import { ListView } from "patternfly-react";

import GetDataSources from "../../graphql/GetDataSources.graphql";
import { DataSourcesListItem } from "./DataSourcesListItem";

const DataSourcesList = ({ filter }) => (
    <Query query={GetDataSources} variables={filter}>
        {({ loading, error, data }) => {
            if (loading) {
                return "Loading...";
            }
            if (error) {
                return error.message;
            }
            const items = data.dataSources.map(item => (
                <DataSourcesListItem item={item} key={item.id} />
            ));

            return (
                <div>
                    <ListView>{items}</ListView>
                </div>
            );
        }}
    </Query>
);

export { DataSourcesList };
