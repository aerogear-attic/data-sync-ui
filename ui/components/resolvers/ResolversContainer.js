import React, { Component } from "react";
import { MessageDialog, Icon } from "patternfly-react";
import { CommonToolbar } from "../common";
import { ResolversList } from "./ResolversList";
import { ResolverDetail } from "./ResolverDetail";

import styles from "./resolversContainer.css";

const INITIAL_STATE = {
    resolver: null,
    clickedResolver: null,
    isResolverSaved: true,
    showChangeConfirmation: false,
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
        const { isResolverSaved } = this.state;

        if (isResolverSaved) {
            this.setState({ resolver });
        } else {
            this.setState({ showChangeConfirmation: true, clickedResolver: resolver });
        }
    }

    ignoreChangesAndChangeResolver() {
        const { clickedResolver } = this.state;
        this.setState({
            resolver: clickedResolver,
            clickedResolver: null,
            showChangeConfirmation: false,
            isResolverSaved: true
        });
    }

    cancelChangeResolver() {
        this.setState({ showChangeConfirmation: false, clickedResolver: null });
    }

    onResolverEdit({ isResolverSaved }) {
        this.setState({ isResolverSaved });
    }

    render() {
        const { resolver, showChangeConfirmation } = this.state;

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
                        <ResolverDetail resolver={resolver} onResolverEdit={e => this.onResolverEdit(e)} />
                    </div>
                </div>
                <MessageDialog
                    show={showChangeConfirmation}
                    onHide={() => this.cancelChangeResolver()}
                    primaryAction={() => this.ignoreChangesAndChangeResolver()}
                    secondaryAction={() => this.cancelChangeResolver()}
                    primaryActionButtonContent="Ignore Changes"
                    secondaryActionButtonContent="Cancel"
                    title="Unsaved Changes"
                    icon={<Icon type="pf" name="warning-triangle-o" />}
                    primaryContent={<p className="lead">Changes on the resolver will be lost</p>}
                    secondaryContent={<p>Please save your resolver before selecting a different one or all changes will be lost.</p>}
                />
            </React.Fragment>
        );
    }

}

export { ResolversContainer };
