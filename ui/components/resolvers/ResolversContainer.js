import React, { Component } from "react";
import { CommonToolbar } from "../common";
import { ResolversList } from "./ResolversList";
import { ResolverDetail } from "./ResolverDetail";

import styles from "./resolversContainer.css";

const INITIAL_STATE = {
    resolver: null,
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

    onResolverClicked(resolver) {
        this.setState({ resolver });
    }

    render() {
        const { resolver } = this.state;

        return (
            <React.Fragment>
                <CommonToolbar
                    buttons={this.getToolbarButtons()}
                    onFilter={name => this.setFilter(name)}
                />
                <div className={styles.flexWrapper}>
                    <div className={styles.resolversListContainer}>
                        <ResolversList onClick={res => this.onResolverClicked(res)} />
                    </div>
                    <div className={styles.resolverDetailContainer}>
                        <ResolverDetail resolver={resolver} />
                    </div>
                </div>
            </React.Fragment>
        );
    }

}

export { ResolversContainer };
