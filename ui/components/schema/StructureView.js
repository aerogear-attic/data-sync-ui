import React from "react";
import { Alert, ListView } from "patternfly-react";
import { DefaultEmptyView } from "../common/DefaultEmptyView";
import { TypeList } from "./TypeList";
import { wellKnownTypes } from "../../graphql/types/GraphQLWellKnownTypes";

import style from "./structureView.css";

// Graphql internal types that we don't want to render

const renderListView = (compiled, schemaId) => {
    const { types } = compiled.data.__schema;
    const relevantTypes = types.filter(type => wellKnownTypes.indexOf(type.name) < 0);
    return (
        <ListView>
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
    <div className={style["structure-content"]}>
        <div className={style["structure-header"]}>
            <span>Data Types</span>
        </div>
        { renderListView(compiled, schemaId) }
    </div>
);

const renderError = error => {
    const { message } = error;
    return (<Alert className={style.alertBox}>{message}</Alert>);
};

const StructureView = props => {
    const { error, compiled, schemaId } = props;
    if (error) {
        return renderError(error);
    } if (compiled) {
        return renderContent(compiled, schemaId);
    }
    return <DefaultEmptyView text="No Schema Defined" />;
};

export { StructureView };
