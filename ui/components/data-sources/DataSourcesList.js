import React from "react";
import { Query } from "react-apollo";
import { ListView, Spinner } from "patternfly-react";
import { EmptyList } from "./EmptyList";
import GetDataSources from "../../graphql/GetDataSources.graphql";
import { DataSourcesListItem } from "./DataSourcesListItem";

const DataSourcesList = ({ filter, onCreate, onEditDataSource, onDeleteDataSource }) => {
    const renderItems = data => data.dataSources.map(item => (
        <DataSourcesListItem
            item={item}
            key={item.id}
            onEditDataSource={onEditDataSource}
            onDeleteDataSource={onDeleteDataSource}
        />
    ));

    return (
        <Query query={GetDataSources} variables={filter}>
            {({ loading, error, data }) => {
                if (loading) {
                    return "Loading...";
                }

                if (error) {
                    return error.message;
                }

                if (data.dataSources.length) {
                    return <ListView>{renderItems(data)}</ListView>;
                }

                return <EmptyList createDataSource={onCreate} />;
            }}
        </Query>
    );
};

export { DataSourcesList };
