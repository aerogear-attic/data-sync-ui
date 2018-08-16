import React from "react";
import { Alert, ListView } from "patternfly-react";
import { DefaultEmptyView } from "../common/DefaultEmptyView";
import { TypeList } from "./TypeList";
import { wellKnownTypes } from "../../graphql/types/GraphQLWellKnownTypes";

import styles from "./structureView.css";

const renderListView = (compiled, schemaId) => {
    const { types } = compiled.data.__schema;
    const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);
    return (
        <ListView className={styles.structureViewList}>
            {
                relevantTypes.map(type => (
                    <TypeList
                        key={type.name}
                        schemaId={schemaId}
                        type={type}
                    />
                ))
            }
        </ListView>
    );
};

const renderContent = (compiled, schemaId) => (
    <div className={styles.structureContent}>
        <div className={styles.structureHeader}>
            <span>Data Types</span>
        </div>
        { renderListView(compiled, schemaId) }
    </div>
);

const renderError = error => {
    const { message } = error;
    return (<Alert className={styles.alertBox}>{message}</Alert>);
};

const StructureView = props => {
    const { error, compiled, schemaId } = props;
    if (error) {
        return renderError(error);
    } if (compiled) {
        return renderContent(compiled, schemaId);
    }
    return (
        <DefaultEmptyView
            text="You must define a Schema for data sync to work correctly"
            infoText="Schema Reference"
            infoURL="https://graphql.org/learn/schema/"
        />
    );
};

export { StructureView };
