import React from "react";
import { Query } from "react-apollo";

import {
    MenuItem,
    InputGroup,
    FormControl,
    DropdownButton,
    Col
} from "patternfly-react";

import GetDataSources from "../../graphql/GetDataSources.graphql";

import { dataSourceControlLabel, dataSourceFormControl } from "./DataSourcesDropDown.css";

const DataSourcesDropDown = ({ selected, onDataSourceSelect }) => {
    const filter = undefined;
    return (
        <React.Fragment>
            <Col sm={2} className={dataSourceControlLabel}>Data Source</Col>
            <Col sm={6}>
                <Query query={GetDataSources} variables={filter}>
                    {({ loading, error, data: { dataSources } = {} }) => {
                        const disableDropdown = loading
                            || typeof error === "object"
                            || !dataSources;

                        const options = dataSources
                            ? dataSources.map(dataSource => (
                                <MenuItem key={dataSource.id} eventKey={dataSource}>
                                    {`${dataSource.name} (${dataSource.type})`}
                                </MenuItem>
                            ))
                            : null;

                        return (
                            <InputGroup>
                                <FormControl
                                    disabled
                                    className={dataSourceFormControl}
                                    value={selected ? selected.name : ""}
                                    placeholder="Select a Data Source"
                                />
                                <InputGroup.Button>
                                    <DropdownButton
                                        disabled={disableDropdown}
                                        bsStyle="default"
                                        id="dropdown-type"
                                        title=""
                                        onSelect={ds => onDataSourceSelect(ds)}
                                    >
                                        {options}
                                    </DropdownButton>
                                </InputGroup.Button>
                            </InputGroup>
                        );
                    }}
                </Query>
            </Col>
        </React.Fragment>
    );
};

export { DataSourcesDropDown };
