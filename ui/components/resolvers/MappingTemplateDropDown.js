import React from "react";
import {
    Col,
    InputGroup,
    MenuItem,
    SplitButton
} from "patternfly-react";
import { CodeEditor } from "../common";

import {
    mappingControlLabel,
    mappingDropDown,
    detailCodeEditor
} from "./mappingTemplateDropDown.css";

const TEMPLATES = ["Custom", "Template 1", "Template 2"];

const MappingTemplateDropDown = ({ label, template, text, onTemplateSelect, onTextChange }) => (
    <React.Fragment>
        <Col sm={6} className={mappingControlLabel}>{label}</Col>
        <Col sm={6} className="pull-right">
            <InputGroup className="pull-right">
                <SplitButton
                    pullRight
                    bsStyle="default"
                    id="dropdown-type"
                    title={template}
                    className={mappingDropDown}
                    onSelect={t => onTemplateSelect(t)}
                >
                    {TEMPLATES.map(t => <MenuItem eventKey={t}>{t}</MenuItem>)}
                </SplitButton>
            </InputGroup>
        </Col>
        <Col sm={12}>
            <div className={detailCodeEditor}>
                <CodeEditor
                    value={text}
                    onChange={t => onTextChange(t)}
                />
            </div>
        </Col>
    </React.Fragment>
);

export { MappingTemplateDropDown };
