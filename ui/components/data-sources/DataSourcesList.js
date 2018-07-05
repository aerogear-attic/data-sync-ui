import React from "react";
import { Query } from "react-apollo";
import { ListView, DropdownKebab } from "patternfly-react";

import GetDataSources from "../../graphql/GetDataSources.graphql";

const DataSourcesList = () => (
    <Query query={GetDataSources}>
        {({ loading, error, data }) => {
            if (loading) {
                return "Loading...";
            }
            if (error) {
                return error.message;
            }

            const items = data.dataSources.map(item => (
                <ListView.Item
                    key={item.id}
                    className="ds-list-item"
                    heading={item.type}
                    description="---"
                    leftContent={<span className="list-item-name">{item.name}</span>}
                    actions={(
                        <div>
                            <DropdownKebab id="DataSource Dropdown" pullRight />
                        </div>
                    )}
                />
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
