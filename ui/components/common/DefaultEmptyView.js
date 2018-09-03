import React from "react";
import {
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";
import { LearnMore } from "./LearnMore";

import { emptyContainer, emptyTitle } from "./defaultEmptyView.css";

const DefaultEmptyView = ({ text, infoText, infoURL }) => (
    <EmptyState className={emptyContainer}>
        <EmptyStateIcon name="info" />
        <EmptyStateTitle className={emptyTitle}>
            {text}
        </EmptyStateTitle>
        {infoText ? <LearnMore text={infoText} url={infoURL} /> : null}
    </EmptyState>
);

export { DefaultEmptyView };
