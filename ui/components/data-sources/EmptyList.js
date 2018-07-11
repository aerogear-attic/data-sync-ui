import React from "react";
import {
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle,
    EmptyStateInfo,
    EmptyStateHelp,
    EmptyStateAction
} from "patternfly-react";

const EmptyList = ({ createDataSource }) => (
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
                onClick={createDataSource}
            >
                    Add a Data Source
            </Button>
        </EmptyStateAction>
    </EmptyState>
);

export { EmptyList };
