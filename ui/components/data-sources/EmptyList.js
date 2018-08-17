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

const EmptyList = ({ action, title, info, actionName }) => (
    <EmptyState className={emptyListContainer}>
        <EmptyStateIcon />
        <EmptyStateTitle>
            {title}
        </EmptyStateTitle>
        <EmptyStateInfo>
            {info}
        </EmptyStateInfo>
        <EmptyStateHelp>
            For more information have a look at the <a href="https://docs.aerogear.org">&nbsp;docs</a>
        </EmptyStateHelp>
        <EmptyStateAction>
            <Button
                bsStyle="primary"
                bsSize="large"
                onClick={action}
            >
                {actionName}
            </Button>
        </EmptyStateAction>
    </EmptyState>
);

export { EmptyList };
