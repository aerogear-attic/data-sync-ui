import React from "react";
import {
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";

import style from "./structureView.css";

const EmptyStructureView = () => (
    <EmptyState style={{ margin: "5px" }} className={style.reducePadding}>
        <EmptyStateIcon />
        <EmptyStateTitle>
            No Schema defined
        </EmptyStateTitle>
    </EmptyState>
);

export { EmptyStructureView };
