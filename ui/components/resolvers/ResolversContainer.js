import React, { Component } from "react";
import { CommonToolbar } from "../common";
import { ResolversList } from "./ResolversList";

const INITIAL_STATE = {
    filter: {}
};

class ResolversContainer extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    getToolbarButtons() {
        return [];
    }

    setFilter() {
        // TODO
    }

    render() {
        return (
            <React.Fragment>
                <CommonToolbar
                    buttons={this.getToolbarButtons()}
                    onFilter={name => this.setFilter(name)}
                />
                <ResolversList />
            </React.Fragment>
        );
    }

}

export { ResolversContainer };
