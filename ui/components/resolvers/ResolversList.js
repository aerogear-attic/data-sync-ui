import React from "react";
import { Query } from "react-apollo";
import { ListView, Spinner } from "patternfly-react";
import { ResolversListItem } from "./ResolversListItem";

import GetResolvers from "../../graphql/GetResolvers.graphql";

const ResolversList = () => {
    const renderItems = data => data.resolvers.map(item => (
        <ResolversListItem
            item={item}
            key={item.id}
        />
    ));
    return (
        <Query query={GetResolvers} variables={{ schemaId: 1, type: "Note" }}>
            {({ loading, error, data }) => {
                if (loading) {
                    return <Spinner className="spinner" loading />;
                }

                if (error) {
                    return error.message;
                }

                if (data.resolvers.length) {
                    return <ListView>{renderItems(data)}</ListView>;
                }

                return "Empty";
            }}
        </Query>
    );
};

export { ResolversList };
