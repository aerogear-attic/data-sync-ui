import React from "react";
import { Query } from "react-apollo";
import {
    ListView,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateInfo,
    EmptyStateHelp,
    EmptyStateAction
} from "patternfly-react";

import GetDataSources from "../../graphql/GetDataSources.graphql";
import { DataSourcesListItem } from "./DataSourcesListItem";

const EmptyList = ({ action }) => (
    <EmptyState style={{ margin: "15px" }}>
        <EmptyStateIcon />
        <EmptyStateTitle>
                No Data Sources defined
        </EmptyStateTitle>
        <EmptyStateInfo>
                Data Sources are used to store and retrieve your data.
                You should define at least one in order to use it in a resolver mapping.
        </EmptyStateInfo>
        <EmptyStateHelp>
                For more information have a look at the
            <a href="https://docs.aerogear.org">&nbsp;docs</a>
        </EmptyStateHelp>
        <EmptyStateAction>
            <Button
                bsStyle="primary"
                bsSize="large"
                onClick={() => {
                    action();
                }}
            >
                    Add a Data Source
            </Button>
        </EmptyStateAction>
    </EmptyState>
);

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
                return (<div><ListView>{items}</ListView></div>);
            }
            return <EmptyList action={onCreate} />;
        }}
    </Query>
);

export { DataSourcesList };
