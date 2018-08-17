import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
    Form,
    FormGroup,
    Button
} from "patternfly-react";
import some from "lodash.some";
import {
    Validate,
    ValidateAny,
    Validators
} from "../../helper/Validators";

import { DataSourcesDropDown } from "./DataSourcesDropDown";
import { SubscriptionsDropDown } from "./SubscriptionsDropDown";
import { MappingTemplateDropDown } from "./MappingTemplateDropDown";
import { HookFormGroup } from "./HookFormGroup";
import { DeleteResolverDialog } from "./DeleteResolverDialog";
import { DefaultEmptyView } from "../common/DefaultEmptyView";

import UpsertResolver from "../../graphql/UpsertResolver.graphql";
import GetDataSources from "../../graphql/GetDataSources.graphql";
import GetSchema from "../../graphql/GetSchema.graphql";
import GetResolvers from "../../graphql/GetResolvers.graphql";

import { getTemplatesForDataSource } from "./MappingTemplates";

import {
    detailHeader, detailFormsContainer, learnMore, detailFormsHeader, formContainer,
    detailFormGroup, detailButtonFooter, buttonSave, buttonDelete
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
        requestMapping: null
    }
};

class ResolverDetail extends Component {

    constructor(props) {
        super(props);
        const { resolver } = this.props;
        this.state = { ...INITIAL_STATE, resolver };

        if (resolver && resolver.id) {
            this.state.validations = {};
        }
    }

    componentWillReceiveProps({ resolver }) {
        if (this.props.resolver !== resolver) {
            const newState = { ...INITIAL_STATE, resolver };
            if (resolver && resolver.id) {
                newState.validations = {};
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

    onSubscriptionSelect(subscription) {
        this.updateResolver({ subscription });
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
        const { id, DataSource, type, field, preHook, postHook, requestMapping, responseMapping } = resolver;

        const schemaId = resolver.schemaId || resolver.GraphQLSchemaId;

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
                { query: GetDataSources, variables: undefined },
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

    render() {
        const {
            resolver, requestMappingTemplate, responseMappingTemplate, isResolverSaved,
            showDeleteModal, validations
        } = this.state;

        if (!resolver) {
            return <DefaultEmptyView text="Select an item to view and edit its details" />;
        }

        const { field, type, DataSource, requestMapping, responseMapping, preHook, postHook, subscription } = resolver;
        const { requestMappingTemplates, responseMappingTemplates } = getTemplatesForDataSource(DataSource);

        const isSaveButtonDisabled = isResolverSaved || some(validations, s => s === null || s === "error");

        return (
            <React.Fragment>
                <h3 className={detailHeader}>Edit {type}.{field}</h3>
                <div className={detailFormsContainer}>
                    <h3 className={detailFormsHeader}>
                        <span style={{ marginRight: "12px" }}>Resolver</span>
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
                                label="Pre Hook"
                                url={preHook}
                                onChange={hook => this.onPreHookChange(hook)}
                            />
                        </FormGroup>

                        <FormGroup controlId="postHook" className={detailFormGroup} validationState={validations.postHook}>
                            <HookFormGroup
                                label="Post Hook"
                                url={postHook}
                                onChange={hook => this.onPostHookChange(hook)}
                            />
                        </FormGroup>

                        <FormGroup controlId="subscription" className={detailFormGroup} validationState={validations.subscription}>
                            <SubscriptionsDropDown
                                selected={subscription}
                                onSubscriptionSelect={s => this.onSubscriptionSelect(s)}
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
                        className={buttonDelete}
                        style={!resolver || !resolver.id ? { display: "none" } : {}}
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
