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

import { emptyListContainer } from "./EmptyList.css";

const EmptyList = ({ createDataSource }) => (
    <EmptyState className={emptyListContainer}>
        <EmptyStateIcon name="info" />
        <EmptyStateTitle>
                You have no data sources attached to this project
        </EmptyStateTitle>
        <EmptyStateInfo>
                Data Sources are used to store and retrieve your data.
                You should define at least one in order to use it in a resolver mapping.
        </EmptyStateInfo>
        <EmptyStateHelp>
                For more information have a look at the <a href="https://docs.aerogear.org">docs</a>
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
