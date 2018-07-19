import React, { Component } from "react";
import { Toolbar, Button } from "patternfly-react";
import { DebounceInput } from "react-debounce-input";

import styles from "./commonToolbar.css";

class CommonToolbar extends Component {

    constructor(props) {
        super(props);

        this.state = { buttons: props.buttons };
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ buttons: nextProps.buttons });
    }

    renderElements() {
        const { buttons } = this.state;
        return buttons.map(button => (
            <Button
                className={styles.toolbarButton}
                bsStyle="primary"
                {...button.props}
            >
                {button.title}
            </Button>
        ));
    }

    handleKeyPress(event) {
        if (event.charCode === 13) {
            event.preventDefault();
        }
    }

    render() {
        const { onFilter } = this.props;

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
                        onKeyPress={e => this.handleKeyPress(e)}
                    />
                    {this.renderElements()}
                </Toolbar>
            </div>
        );
    }

}

export { CommonToolbar };
