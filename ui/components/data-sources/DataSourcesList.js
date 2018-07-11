import React from "react";
import { Query } from "react-apollo";
import { ListView } from "patternfly-react";
import { EmptyList } from "./EmptyList";
import GetDataSources from "../../graphql/GetDataSources.graphql";
import { DataSourcesListItem } from "./DataSourcesListItem";


const DataSourcesList = ({ filter, onCreate }) => (
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

            if (items.length > 0) {
                return (<ListView>{items}</ListView>);
            }
            return <EmptyList createDataSource={onCreate} />;
        }}
    </Query>
);

export { DataSourcesList };
