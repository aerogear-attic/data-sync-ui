import React from "react";
import { Query } from "react-apollo";
import { ListView, Spinner } from "patternfly-react";
import { EmptyList } from "./EmptyList";
import GetDataSources from "../../graphql/GetDataSources.graphql";
import { DataSourcesListItem } from "./DataSourcesListItem";

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
                const whenFiltered = Object.keys(filter).length > 0;
                const title = whenFiltered ? "No item found while filtering the data sources" : "No Data Sources defined";
                const info = whenFiltered ? "Please change your filtering query or empty the Filter field." : "Data Sources are used to store and retrieve your data. You should define at least one in order to use it in a resolver mapping.";
                const actionName = whenFiltered ? "Clear the filter" : "Add a Data Source";

                return <EmptyList action={whenFiltered ? onClearFilter : onCreate} title={title} info={info} actionName={actionName} />;
            }}
        </Query>
    );
};

export { DataSourcesList };
