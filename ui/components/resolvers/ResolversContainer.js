import React, { Component } from "react";
import { CommonToolbar } from "../common";
import { ResolversList } from "./ResolversList";
import { ResolverDetail } from "./ResolverDetail";

import styles from "./resolversContainer.css";

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
                <div className={styles.flexWrapper}>
                    <div className={styles.left}>
                        <ResolversList />
                    </div>
                    <div className={styles.right}>
                        <ResolverDetail />
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export { ResolversContainer };
