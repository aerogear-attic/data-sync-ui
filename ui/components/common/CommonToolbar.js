import React from "react";
import { Toolbar, Button } from "patternfly-react";

const CommonToolbar = ({ buttons, update }) => {
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
                <input
                    type="text"
                    placeholder="Filter by Name"
                    style={{ height: "26px" }}
                    onChange={e => update(e.target.value)}
                />
                {elements}
            </Toolbar>
        </div>
    );
};

export { CommonToolbar };
