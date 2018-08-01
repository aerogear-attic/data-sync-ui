import React, { Component } from "react";
import {
    Form,
    FormGroup,
    FormControl,
    InputGroup,
    Col,
    Button,
    DropdownButton,
    MenuItem,
    Icon,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";

import { CodeEditor } from "../common/CodeEditor";
import { DataSourcesDropDown } from "./DataSourcesDropDown";
import { Security } from "./Security";

import styles from "./ResolverDetail.css";

const INITIAL_STATE = {
    resolver: null,
    requestMapping: "",
    responseMapping: "",
    err: "",
    validations: {
        name: null,
        requestMapping: "warning",
        responseMapping: "success"
    }
};

class ResolverDetail extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.resolver !== nextProps.resolver) {
            console.log("Selected:", nextProps.resolver);
            this.setState({ resolver: nextProps.resolver });
        }
    }

    save() {
        console.log("called save");
    }

    cancel() {
        console.log("called cancel");
    }

    renderEmptyScreen() {
        return (
            <EmptyState className={styles.detailEmpty}>
                <EmptyStateIcon name="info" />
                <EmptyStateTitle className={styles.emptyTitle}>
                    Select an item to view and edit its details
                </EmptyStateTitle>
            </EmptyState>
        );
    }

    render() {
        const { resolver, responseMapping, requestMapping, validations } = this.state;

        if (!resolver) {
            return this.renderEmptyScreen();
        }

        return (
            <React.Fragment>
                <h3 className={styles.detailHeader}>Edit {resolver.type}.{resolver.field}</h3>
                <h3 className={styles.detailSubHeader}>Resolver
                    <span className={styles.learnMore}>
                        <a href="https://www.google.es">Learn More <span className="fa fa-external-link" /></a>
                    </span>
                </h3>

            </React.Fragment>
        );
    }

}

export { ResolverDetail };
