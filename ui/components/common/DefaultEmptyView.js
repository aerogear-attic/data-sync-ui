import React from "react";
import {
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";

import {
    emptyContainer,
    emptyTitle,
    learnMore
} from "./defaultEmptyView.css";

const DefaultEmptyView = ({ text, infoText, infoURL }) => (
    <EmptyState className={emptyContainer}>
        <EmptyStateIcon name="info" />
        <EmptyStateTitle className={emptyTitle}>
            {text}
        </EmptyStateTitle>
        {infoText ? (
            <span className={learnMore}>
                <a href={infoURL}>{infoText} <span className="fa fa-external-link" /></a>
            </span>
        ) : null}
    </EmptyState>
);

export { DefaultEmptyView };
