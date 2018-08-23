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
        const { toolbarButton } = styles;

        return buttons.map(button => (
            <Button
                className={toolbarButton}
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
        const { onFilter, hideFilter } = this.props;
        const { toolbarContainer, toolbarFilter, toolbarButtonContainer } = styles;
        return (
            <div className={toolbarContainer}>
                <Toolbar>
                    <div hidden={hideFilter}>
                        <DebounceInput
                            minLength={1}
                            debounceTimeout={300}
                            type="text"
                            placeholder="Filter by Name"
                            className={toolbarFilter}
                            onChange={e => onFilter(e.target.value)}
                            onKeyPress={e => this.handleKeyPress(e)}
                        />
                    </div>
                    <div className={toolbarButtonContainer}>
                        {this.renderElements()}
                    </div>
                </Toolbar>
            </div>
        );
    }

}

export { CommonToolbar };
