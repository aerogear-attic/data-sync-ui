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

const MappingTemplateDropDown = ({ label, template, templates, text, onTemplateSelect, onTextChange }) => (
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
                    {
                        Object.keys(templates).map((key, value) => (
                            <MenuItem key={key} eventKey={{ key, value }}>
                                {key}
                            </MenuItem>
                        ))
                    }
                </SplitButton>
            </InputGroup>
        </Col>
        <Col sm={12}>
            <div className={detailCodeEditor}>
                <CodeEditor
                    value={text}
                    onChange={t => onTextChange(t)}
                    placeholder="# Add your mapping here"
                />
            </div>
        </Col>
    </React.Fragment>
);

export { MappingTemplateDropDown };
