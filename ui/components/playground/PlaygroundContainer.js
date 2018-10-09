import React from "react";
import { Provider } from "react-redux";
import { Playground, store } from "graphql-playground-react";
import { Query } from "react-apollo";
import { FormControl } from "patternfly-react";

import GetGraphQLEndpoint from "../../graphql/GetGraphQLEndpoint.graphql";

const settings = {
    "editor.theme": "light",
    "editor.cursorShape": "line"
};

const PlaygroundContainer = () => (
    <Query query={GetGraphQLEndpoint}>
        {({ loading, error, data }) => {
            if (loading || typeof error !== "undefined") {
                return <FormControl.Static>Loading graphql playground...</FormControl.Static>;
            }
            const { getGraphQLEndpoint } = data;
            return (
                <Provider store={store}>
                    <Playground endpoint={getGraphQLEndpoint} settings={settings} />
                </Provider>
            );
        }}
    </Query>
);

export { PlaygroundContainer };
