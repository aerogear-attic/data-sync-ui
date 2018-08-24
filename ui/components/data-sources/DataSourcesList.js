import React from "react";
import { Query } from "react-apollo";
import { ListView, Spinner } from "patternfly-react";
import some from "lodash.some";

import { EmptyList } from "./EmptyList";
import { DataSourcesListItem } from "./DataSourcesListItem";

import GetDataSources from "../../graphql/GetDataSources.graphql";

import { dataSourcesList } from "./DataSourcesList.css";

const DataSourcesList = ({
    filter, onCreate, onEditDataSource,
    onDeleteDataSource, onClearFilter
}) => {
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
                    return <Spinner className="spinner" loading />;
                }

                if (error) {
                    return error.message;
                }

                if (data.dataSources.length) {
                    return <ListView className={dataSourcesList}>{renderItems(data)}</ListView>;
                }

                const thereIsFilter = some(filter, n => n !== undefined);

                if (thereIsFilter) {
                    return (
                        <EmptyList
                            action={onClearFilter}
                            title="No item found while filtering the data sources"
                            info="Please change your filtering query or empty the Filter field."
                            actionName="Clear the filter"
                        />
                    );
                }

                return (
                    <EmptyList
                        action={onCreate}
                        title="No Data Sources defined"
                        info="Data Sources are used to store and retrieve your data. You should define at least one in order to use it in a resolver mapping."
                        actionName="Add a Data Source"
                    />
                );
            }}
        </Query>
    );
};

export { DataSourcesList };
