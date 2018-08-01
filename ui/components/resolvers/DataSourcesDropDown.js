import React from "react";
import { Query } from "react-apollo";

import {
    Spinner,
    MenuItem,
    InputGroup,
    FormControl,
    DropdownButton,
    FormGroup,
    Col
} from "patternfly-react";

import GetDataSources from "../../graphql/GetDataSources.graphql";

import styles from "./DataSourcesDropDown.css";

const DataSourcesDropDown = ({ value, validation }) => {
    const filter = undefined;
    return (
        <FormGroup controlId="dataSource" validationState={validation}>
            <Col sm={2} className={styles.dataSourceControlLabel}>Data Source</Col>
            <Col sm={6}>
                <Query query={GetDataSources} variables={filter}>
                    {({ loading, error, data: { dataSources } }) => {
                        const disableDropdown = loading
                            || error
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
                                    style={{ background: "unset", color: "#363636" }}
                                    value={value}
                                />
                                <InputGroup.Button>
                                    <DropdownButton
                                        disabled={disableDropdown}
                                        bsStyle="default"
                                        id="dropdown-type"
                                        title=""
                                        onSelect={key => console.log(key)}
                                    >
                                        {options}
                                    </DropdownButton>
                                </InputGroup.Button>
                            </InputGroup>
                        );
                    }}
                </Query>
            </Col>
        </FormGroup>
    );
};

export { DataSourcesDropDown };
