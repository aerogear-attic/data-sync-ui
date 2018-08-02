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

import { DataSourcesDropDown } from "./DataSourcesDropDown";
import { RequestMappingTemplateDropDown } from "./RequestMappingTemplateDropDown";
import { ResponseMappingTemplateDropDown } from "./ResponseMappingTemplateDropDown";
import { CodeEditor } from "../common/CodeEditor";
import { Security } from "./Security";

import styles from "./ResolverDetail.css";

const INITIAL_STATE = {
    resolver: null,
    dataSource: null,
    requestMapping: "Custom",
    responseMapping: "",
    err: ""
};

class ResolverDetail extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.resolver !== nextProps.resolver) {
            this.setState({ resolver: nextProps.resolver });
        }
    }

    onDataSourceSelect(dataSource) {
        this.setState({ dataSource });
    }

    onRequestMappingDropDownSelect(requestMapping) {
        this.setState({ requestMapping });
    }

    onResponseMappingDropDownSelect(responseMapping) {
        this.setState({ responseMapping });
    }

    onResponseMappingTemplateChange(text) {
        console.log("response mapping template:", text);
    }

    onRequestMappingTemplateChange(text) {
        console.log("request mapping template:", text);
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
        const { resolver, dataSource, responseMapping, requestMapping } = this.state;

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

                <Form horizontal className={styles.formContainer}>
                    <FormGroup controlId="dataSource">
                        <DataSourcesDropDown
                            selected={dataSource}
                            onDataSourceSelect={ds => this.onDataSourceSelect(ds)}
                        />
                    </FormGroup>

                    <FormGroup controlId="responseMapping">
                        <ResponseMappingTemplateDropDown
                            value={responseMapping}
                            onSelect={item => this.onResponseMappingDropDownSelect(item)}
                        />
                        <Col sm={12}>
                            <div className={styles.detailCodeEditor}>
                                <CodeEditor
                                    value={responseMapping}
                                    onChange={text => this.onResponseMappingTemplateChange(text)}
                                />
                            </div>
                        </Col>
                    </FormGroup>

                    <FormGroup controlId="requestMapping">
                        <RequestMappingTemplateDropDown
                            value={requestMapping}
                            onSelect={item => this.onRequestMappingDropDownSelect(item)}
                        />
                        <Col sm={12}>
                            <div className={styles.detailCodeEditor}>
                                <CodeEditor
                                    value={requestMapping}
                                    onChange={text => this.onRequestMappingTemplateChange(text)}
                                />
                            </div>
                        </Col>
                    </FormGroup>
                </Form>

            </React.Fragment>
        );
    }

}

export { ResolverDetail };
