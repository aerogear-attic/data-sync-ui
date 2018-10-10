import React from "react";
import { Provider } from "react-redux";
import { Playground, store } from "graphql-playground-react";

const settings = {
    "editor.theme": "light",
    "editor.cursorShape": "line"
};

const PlaygroundContainer = props => {
    const { data } = props;
    return (
        <Provider store={store}>
            <Playground endpoint={`/projects/${data.variables.name}`} settings={settings} />
        </Provider>
    );
};

export { PlaygroundContainer };
