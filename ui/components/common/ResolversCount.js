import React from "react";

import { Icon } from "patternfly-react";

import { resolversCount } from "./ResolversCount.css";

const ResolversCount = ({ total, defined }) => (
    <div className={resolversCount}>
        <p>
            {defined === total ? <Icon type="pf" name="ok" /> : null}
            <span>{defined}/{total}</span>
            {total === 1 ? "Resolver" : "Resolvers"}
        </p>
    </div>
);

export { ResolversCount };
