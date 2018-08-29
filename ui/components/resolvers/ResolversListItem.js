import React from "react";
import { CustomTypeResolversListItem, GenericTypeResolversListItem } from "./resolvers-list-item";

const ResolversListItem = props => {
    switch (props.kind) {
        case "custom":
            return <CustomTypeResolversListItem {...props} />;
        default:
            return <GenericTypeResolversListItem {...props} />;
    }
};

export { ResolversListItem };
