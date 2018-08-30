import React from "react";

import { Icon } from "patternfly-react";

import { resolversCount } from "./ResolversCount.css";

const ResolversCount = ({ fields = [], resolvers = [] }) => {
    const total = fields.length;
    const defined = fields.reduce((prev, curr) => {
        const resolver = resolvers.find(r => r.field === curr.name);
        return resolver ? prev + 1 : prev;
    }, 0);

    return (
        <div className={resolversCount}>
            <p>
                {defined === total ? <Icon type="pf" name="ok" /> : null}
                <span>{defined}/{total}</span>
                {total === 1 ? "Resolver" : "Resolvers"}
            </p>
        </div>
    );
};

export { ResolversCount };
