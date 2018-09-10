import React from "react";
import { Provider } from "react-redux";
import { Playground, store } from "graphql-playground-react";

const settings = {
    "editor.theme": "light",
    "editor.cursorShape": "line"
};

const QueriesContainer = () => (
    <Provider store={store}>
        <Playground endpoint="http://localhost:8000/graphql" settings={settings} />
    </Provider>
);

export { QueriesContainer };
