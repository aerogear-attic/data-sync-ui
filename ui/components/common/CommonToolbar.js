import React from "react";
import { Toolbar, Button } from "patternfly-react";
import { DebounceInput } from "react-debounce-input";

const CommonToolbar = ({ buttons, onFilter }) => {
    const elements = buttons.map(button => (
        <Button
            style={{ float: "right" }}
            key={button.id}
            bsStyle="primary"
            onClick={button.cb}
        >
            {button.title}
        </Button>
    ));

    return (
        <div className="toolbar-container">
            <Toolbar>
                <DebounceInput
                    minLength={1}
                    debounceTimeout={300}
                    type="text"
                    placeholder="Filter by Name"
                    style={{ height: "26px" }}
                    onChange={e => onFilter(e.target.value)}
                />
                {elements}
            </Toolbar>
        </div>
    );
};

export { CommonToolbar };
