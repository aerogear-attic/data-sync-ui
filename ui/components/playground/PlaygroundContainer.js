import React from "react";
import { Provider } from "react-redux";
import { Playground, store } from "graphql-playground-react";

const settings = {
    "editor.theme": "light",
    "editor.cursorShape": "line"
};

const PlaygroundContainer = () => (
    <Provider store={store}>
        <Playground endpoint="/graphqldata" settings={settings} />
    </Provider>
);

export { PlaygroundContainer };
