import React from "react";
import ReactDOM from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import App from "./components/app";

// TODO: ApolloClient from "apollo-boost" uses HttpLink and InMemoryCache by default.
// We might not need it.
const client = new ApolloClient();

ReactDOM.render(
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>,
    document.getElementById("app")
);
