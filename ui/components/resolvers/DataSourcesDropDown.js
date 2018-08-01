import React from "react";
import { Query } from "react-apollo";

import {
    Spinner,
    MenuItem,
    InputGroup,
    FormControl,
    DropdownButton
} from "patternfly-react";

import GetDataSources from "../../graphql/GetDataSources.graphql";

const DataSourcesDropDown = ({ dataSourceName }) => {
    const filter = undefined;
    return (
        <InputGroup>
            <FormControl
                disabled
                style={{ backgroundColor: "#fff", color: "#363636" }}
                value={dataSourceName}
            />
            <InputGroup.Button>
                <DropdownButton
                    disabled={false}
                    bsStyle="default"
                    id="dropdown-type"
                    title=""
                    onSelect={() => {
                        console.log("on select called");
                    }}
                >
                    <Query query={GetDataSources} variables={filter}>
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <Spinner className="spinner" loading />;
                            }
                            if (error) {
                                return error.message;
                            }
                            if (data.dataSources.length) {
                                const { dataSources } = data;
                                return dataSources.map(dataSource => (
                                    <MenuItem key={dataSource.id} eventKey={dataSource}>
                                        {`${dataSource.name} (${dataSource.type})`}
                                    </MenuItem>
                                ));
                            }
                            return null;
                        }}
                    </Query>
                </DropdownButton>
            </InputGroup.Button>
        </InputGroup>
    );
};

export {  DataSourcesDropDown  };
