import React from "react";
import { Alert, ListView } from "patternfly-react";
import { EmptyStructureView } from "./EmptyStructureView";
import { TypeList } from "./TypeList";
import { AddResolverDialog } from "./AddResolverDialog";
import style from "./structureView.css";

// Graphql internal types that we don't want to render
const wellKnownTypes = [
    "String",
    "Boolean",
    "Int",
    "__Schema",
    "__Type",
    "__TypeKind",
    "__Field",
    "__InputValue",
    "__EnumValue",
    "__Directive",
    "__DirectiveLocation"
];

const renderListView = (compiled, schemaId, onAddResolver) => {
    console.log("in render list view", onAddResolver);
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
                        onAddResolver={onAddResolver
                        }
                    />
                ))
            }
        </ListView>
    );
};

const renderContent = (compiled, schemaId, onAddResolver) => (
    <div className={style["structure-content"]}>
        <div className={style["structure-header"]}>
            <span>Data Types</span>
            <a
                className={style["ag-link"]}
                target="_blank"
                rel="noopener noreferrer"
                href="https://docs.aerogear.org"
            >
                {"Learn more \u2139"}
            </a>
        </div>
        <div>
            { renderListView(compiled, schemaId, onAddResolver) }
        </div>
    </div>
);

const renderError = error => {
    const { message } = error;
    return (<Alert className={style.alertBox}>{message}</Alert>);
};

const StructureView = props => {
    console.log("structure view props", props);
    const { error, compiled, schemaId, onAddResolver } = props;
    console.log("afterwards", onAddResolver);
    if (error) {
        return renderError(error);
    } if (compiled) {
        return renderContent(compiled, schemaId, onAddResolver);
    }
    return <EmptyStructureView />;
};

export { StructureView };
