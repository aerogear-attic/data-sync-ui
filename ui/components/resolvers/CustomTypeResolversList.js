import React from "react";
import { ListView } from "patternfly-react";
import { CustomTypeResolversListItem } from "./resolvers-list-item";

import styles from "./ResolversListItem.css";
import { learnMore } from "../common/common.css";

/**
 * A CustomTypeItem is used to render a user defined GraphQL type in the resolver tab's
 * structure view
 */
const CustomTypeResolversList = props => {
    const { items, text, schemaId, kind, onClick } = props;
    const { resolversContent, resolversHeader, resolversHeaderName, resolversList } = styles;
    return (
        <div className={resolversContent}>
            <div className={resolversHeader}>
                <div className={resolversHeaderName}>
                    <span style={{ marginRight: "12px" }}>{text}</span>
                    <span className={learnMore}>
                        <a href="https://www.google.es">Learn More <span className="fa fa-external-link" /></a>
                    </span>
                </div>
            </div>
            <ListView className={resolversList}>
                {items.map(item => (
                    <CustomTypeResolversListItem
                        schemaId={schemaId}
                        key={item.name}
                        type={item.name}
                        kind={kind}
                        item={item}
                        onClick={onClick}
                    />
                ))}
            </ListView>
        </div>
    );
};

export { CustomTypeResolversList };
