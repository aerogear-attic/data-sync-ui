import React from "react";
import {
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";

import style from "./defaultEmptyView.css";

const DefaultEmptyView = ({ text }) => (
    <EmptyState style={{ margin: "5px" }} className={style.reducePadding}>
        <EmptyStateIcon />
        <EmptyStateTitle>
            {text}
        </EmptyStateTitle>
    </EmptyState>
);

export { DefaultEmptyView };
