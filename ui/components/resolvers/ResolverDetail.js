import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
    Form,
    FormGroup,
    Col,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";

import { DataSourcesDropDown } from "./DataSourcesDropDown";
import { RequestMappingTemplateDropDown } from "./RequestMappingTemplateDropDown";
import { ResponseMappingTemplateDropDown } from "./ResponseMappingTemplateDropDown";
import { CodeEditor } from "../common/CodeEditor";

import UpsertResolver from "../../graphql/UpsertResolver.graphql";
import GetSchema from "../../graphql/GetSchema.graphql";

import styles from "./ResolverDetail.css";

const INITIAL_STATE = {
    id: null,
    schemaId: null,
    field: null,
    type: null,
    DataSource: null,
    preHook: null,
    postHook: null,
    requestMapping: "",
    responseMapping: "",
    requestMappingTemplate: "Custom",
    responseMappingTemplate: "Custom",
    err: ""
};

class ResolverDetail extends Component {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentWillReceiveProps(nextProps) {
        if (this.props !== nextProps) {
            const {
                id, schemaId, field, type, DataSource, requestMapping,
                responseMapping
            } = nextProps;
            this.setState({
                id, schemaId, field, type, DataSource, requestMapping, responseMapping
            });
        }
    }

    save() {
        const {
            id, schemaId, field, type, DataSource, requestMapping,
            responseMapping
        } = this.state;

        const variables = {
            id,
            schemaId,
            field,
            type,
            dataSourceId: DataSource.id,
            requestMapping,
            responseMapping
        };

        console.log("saving resolver:", variables);

        this.props.mutate({
            variables,
            refetchQueries: [{ query: GetSchema, variables: { name: "default" } }]
        })
            .then(() => console.log("saved"))
            .catch(err => console.log(err));
    }

    cancel() {
        console.log("called cancel");
    }

    renderEmptyScreen() {
        const { detailEmpty, emptyTitle } = styles;
        return (
            <EmptyState className={detailEmpty}>
                <EmptyStateIcon name="info" />
                <EmptyStateTitle className={emptyTitle}>
                    Select an item to view and edit its details
                </EmptyStateTitle>
            </EmptyState>
        );
    }

    render() {
        const {
            field, type, DataSource, requestMapping, responseMapping, requestMappingTemplate,
            responseMappingTemplate
        } = this.state;

        const {
            detailHeader, detailFormsContainer, learnMore, detailFormsHeader, formContainer,
            detailFormGroup, detailCodeEditor, detailButtonFooter, buttonSave
        } = styles;

        if (!field || !type) {
            return this.renderEmptyScreen();
        }

        return (
            <React.Fragment>
                <h3 className={detailHeader}>Edit {type}.{field}</h3>
                <div className={detailFormsContainer}>
                    <h3 className={detailFormsHeader}>Resolver
                        <span className={learnMore}>
                            <a href="https://www.google.es">Learn More <span className="fa fa-external-link" /></a>
                        </span>
                    </h3>

                    <Form horizontal className={formContainer}>
                        <FormGroup controlId="dataSource" className={detailFormGroup}>
                            <DataSourcesDropDown
                                selected={DataSource}
                                onDataSourceSelect={ds => this.setState({ DataSource: ds })}
                            />
                        </FormGroup>

                        <FormGroup controlId="requestMapping" className={detailFormGroup}>
                            <RequestMappingTemplateDropDown
                                value={requestMappingTemplate}
                                onSelect={item => this.setState({ requestMappingTemplate: item })}
                            />
                            <Col sm={12}>
                                <div className={detailCodeEditor}>
                                    <CodeEditor
                                        value={requestMapping}
                                        onChange={t => this.setState({ requestMapping: t })}
                                    />
                                </div>
                            </Col>
                        </FormGroup>

                        <FormGroup controlId="responseMapping" className={detailFormGroup}>
                            <ResponseMappingTemplateDropDown
                                value={responseMappingTemplate}
                                onSelect={item => this.setState({ responseMappingTemplate: item })}
                            />
                            <Col sm={12}>
                                <div className={detailCodeEditor}>
                                    <CodeEditor
                                        value={responseMapping}
                                        onChange={t => this.setState({ responseMapping: t })}
                                    />
                                </div>
                            </Col>
                        </FormGroup>
                    </Form>
                </div>

                <div className={detailButtonFooter}>
                    <Button
                        className={buttonSave}
                        bsStyle="primary"
                        onClick={() => this.save()}
                    >
                        Save
                    </Button>
                    <Button
                        bsStyle="default"
                        onClick={() => this.cancel()}
                    >
                        Cancel
                    </Button>
                </div>

            </React.Fragment>
        );
    }

}

const ResolverDetailWithMutation = graphql(UpsertResolver)(ResolverDetail);

export { ResolverDetailWithMutation as ResolverDetail };
