import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
    Form,
    FormGroup,
    Button,
    EmptyState,
    EmptyStateIcon,
    EmptyStateTitle
} from "patternfly-react";
import some from "lodash.some";
import {
    Validate,
    ValidateAny,
    Validators
} from "../../helper/Validators";

import { DataSourcesDropDown } from "./DataSourcesDropDown";
import { MappingTemplateDropDown } from "./MappingTemplateDropDown";
import { HookFormGroup } from "./HookFormGroup";
import { DeleteResolverDialog } from "./DeleteResolverDialog";

import UpsertResolver from "../../graphql/UpsertResolver.graphql";
import GetSchema from "../../graphql/GetSchema.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";

import { getTemplatesForDataSource } from "./MappingTemplates";

import {
    detailHeader, detailFormsContainer, learnMore, detailFormsHeader, formContainer,
    detailFormGroup, detailButtonFooter, buttonSave, detailEmpty, emptyTitle
} from "./ResolverDetail.css";

const INITIAL_STATE = {
    resolver: null,
    requestMappingTemplate: "Custom",
    responseMappingTemplate: "Custom",
    isResolverSaved: true,
    err: "",
    showDeleteModal: false,
    validations: {
        dataSource: null,
        requestMapping: null,
        responseMapping: "success"
    }
};

class ResolverDetail extends Component {

    constructor(props) {
        super(props);
        const { resolver } = this.props;
        this.state = { ...INITIAL_STATE, resolver };

        if (resolver && resolver.type !== "Query") {
            this.state.validations.preHook = "success";
            this.state.validations.postHook = "success";
        }
    }

    componentWillReceiveProps({ resolver }) {
        if (this.props.resolver !== resolver) {
            const newState = { ...INITIAL_STATE, resolver };
            if (resolver.type === "Query") {
                newState.validations.preHook = undefined;
                newState.validations.postHook = undefined;
            } else {
                newState.validations.preHook = "success";
                newState.validations.postHook = "success";
            }
            this.setState(newState);
        }
    }

    onRequestTemplateSelect({ key, value }) {
        this.onRequestMappingChange(value);
        this.setState({ requestMappingTemplate: key });
    }

    onResponseTemplateSelect({ key, value }) {
        this.onResponseMappingChange(value);
        this.setState({ responseMappingTemplate: key });
    }

    onRequestMappingChange(text) {
        const requestMappingValidation = Validate([
            Validators.String.nonBlank, text
        ]);

        const { validations } = this.state;
        const newValidations = { ...validations, requestMapping: requestMappingValidation };

        this.setState({ validations: newValidations, requestMappingTemplate: "Custom" });
        this.updateResolver({ requestMapping: text });
    }

    onResponseMappingChange(text) {
        const responseMappingValidation = "success";

        const { validations } = this.state;
        const newValidations = { ...validations, responseMapping: responseMappingValidation };

        this.setState({ validations: newValidations, requestMappingTemplate: "Custom" });
        this.updateResolver({ responseMapping: text });
    }

    onDataSourceSelect(DataSource) {
        const dsValidation = DataSource !== null ? "success" : "error";

        const { validations } = this.state;
        const newValidations = { ...validations, dataSource: dsValidation };

        this.setState({ validations: newValidations });
        this.updateResolver({ DataSource });
    }

    onPreHookChange(preHook) {
        const preHookValidation = ValidateAny([
            Validators.URL.valid, preHook,
            s => s === "", preHook
        ]);

        const { validations } = this.state;
        const newValidations = { ...validations, preHook: preHookValidation };

        this.setState({ validations: newValidations });
        this.updateResolver({ preHook });
    }

    onPostHookChange(postHook) {
        const postHookValidation = ValidateAny([
            Validators.URL.valid, postHook,
            s => s === "", postHook
        ]);

        const { validations } = this.state;
        const newValidations = { ...validations, postHook: postHookValidation };

        this.setState({ validations: newValidations });
        this.updateResolver({ postHook });
    }

    updateResolver(newProps) {
        const { resolver } = this.state;
        const { onResolverEdit } = this.props;

        onResolverEdit({ isResolverSaved: false });
        this.setState({ isResolverSaved: false, resolver: { ...resolver, ...newProps } });
    }

    save() {
        const { onResolverEdit } = this.props;
        this.upsertResolver()
            .then(resolver => {
                onResolverEdit({ isResolverSaved: true });

                const { upsertResolver } = resolver.data;
                this.setState({ isResolverSaved: true, resolver: upsertResolver });
            })
            .catch(err => console.log(err));
    }

    upsertResolver() {
        const { resolver } = this.state;
        const { id, schemaId, DataSource, type, field, preHook, postHook, requestMapping, responseMapping } = resolver;

        return this.props.mutate({
            variables: {
                id,
                schemaId,
                dataSourceId: DataSource.id,
                type,
                field,
                preHook,
                postHook,
                requestMapping,
                responseMapping
            },
            refetchQueries: [
                { query: GetSchema, variables: { name: "default" } },
                { query: GetResolvers, variables: { schemaId, type } }
            ]
        });
    }

    removeResolver() {
        this.setState({ showDeleteModal: true });
    }

    onDeleteResolver() {
        this.setState(INITIAL_STATE);
    }

    renderEmptyScreen() {
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
            resolver, requestMappingTemplate, responseMappingTemplate, isResolverSaved,
            showDeleteModal, validations
        } = this.state;

        if (!resolver) {
            return this.renderEmptyScreen();
        }

        const { field, type, DataSource, requestMapping, responseMapping, preHook, postHook } = resolver;
        const { requestMappingTemplates, responseMappingTemplates } = getTemplatesForDataSource(DataSource);

        const disableHooks = type === "Query";
        const isSaveButtonDisabled = isResolverSaved || some(validations, s => !s || s === "error");

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
                        <FormGroup controlId="dataSource" className={detailFormGroup} validationState={validations.dataSource}>
                            <DataSourcesDropDown
                                selected={DataSource}
                                onDataSourceSelect={ds => this.onDataSourceSelect(ds)}
                            />
                        </FormGroup>

                        <FormGroup controlId="requestMapping" className={detailFormGroup} validationState={validations.requestMapping}>
                            <MappingTemplateDropDown
                                label="Request Mapping Template"
                                template={requestMappingTemplate}
                                templates={requestMappingTemplates}
                                text={requestMapping}
                                onTemplateSelect={t => this.onRequestTemplateSelect(t)}
                                onTextChange={t => this.onRequestMappingChange(t)}
                            />
                        </FormGroup>

                        <FormGroup controlId="responseMapping" className={detailFormGroup} validationState={validations.responseMapping}>
                            <MappingTemplateDropDown
                                label="Response Mapping Template"
                                template={responseMappingTemplate}
                                templates={responseMappingTemplates}
                                text={responseMapping}
                                onTemplateSelect={t => this.onResponseTemplateSelect(t)}
                                onTextChange={t => this.updateResolver({ responseMapping: t })}
                            />
                        </FormGroup>

                        <FormGroup controlId="preHook" className={detailFormGroup} validationState={validations.preHook}>
                            <HookFormGroup
                                disabled={disableHooks}
                                label="Pre Hook"
                                url={preHook}
                                onChange={hook => this.onPreHookChange(hook)}
                            />
                        </FormGroup>

                        <FormGroup controlId="postHook" className={detailFormGroup} validationState={validations.postHook}>
                            <HookFormGroup
                                disabled={disableHooks}
                                label="Post Hook"
                                url={postHook}
                                onChange={hook => this.onPostHookChange(hook)}
                            />
                        </FormGroup>
                    </Form>
                </div>

                <div className={detailButtonFooter}>
                    <Button
                        className={buttonSave}
                        bsStyle="primary"
                        onClick={() => this.save()}
                        disabled={isSaveButtonDisabled}
                    >
                        Save
                    </Button>
                    <Button
                        bsStyle="danger"
                        disabled={!resolver || !resolver.id}
                        onClick={() => this.removeResolver()}
                    >
                        Delete Resolver
                    </Button>
                </div>

                <DeleteResolverDialog
                    showModal={showDeleteModal}
                    resolver={resolver}
                    onClose={() => this.setState({ showDeleteModal: false })}
                    onDelete={() => this.onDeleteResolver()}
                />
            </React.Fragment>
        );
    }

}

const ResolverDetailWithMutation = graphql(UpsertResolver)(ResolverDetail);

export { ResolverDetailWithMutation as ResolverDetail };
