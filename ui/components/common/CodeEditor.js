import React, { Component, createRef } from "react";

import style from "./codeEditor.css";

const CodeEditor = class extends Component {

    constructor(props) {
        super(props);

        const { lineHeight, value } = this.props;

        this.state = {
            editorValue: value || "",
            lineHeight: lineHeight || 20
        };

        this.editor = createRef();
        this.gutter = createRef();
    }

    componentDidMount() {
        this.drawLineNumbers();
    }

    componentWillReceiveProps({ value = "" }) {
        if (this.props.value !== value) {
            this.drawLineNumbers();
            this.setState({ editorValue: value });
        }
    }

    onEditorChange() {
        this.drawLineNumbers();
        this.setState({ editorValue: this.editor.current.value });

        const { onChange } = this.props;

        // Propagate update
        if (onChange) {
            onChange(this.editor.current.value);
        }
    }

    // Deal with the tab key: we don't want to loose focus on the
    // textarea but insert a tab character instead
    onEditorKeyDown(event) {
        const editor = this.editor.current;
        if (event.keyCode === 9) {
            event.preventDefault();
            const { selectionStart, selectionEnd, value } = editor;
            editor.value = `${value.substring(0, selectionStart)}\t${value.substring(selectionEnd)}`;
            editor.selectionStart = selectionStart + 1;
            editor.selectionEnd = selectionStart + 1;

            // When the user presses tab we prevent the default propagation, so we need to udpate
            // the state manually here
            this.onEditorChange();
        }
    }

    onEditorScroll() {
        this.adjustGutterPosition();
    }

    getLineCount() {
        const { editorValue } = this.state;
        if (!editorValue) {
            return 0;
        }

        return editorValue.split("\n").length;
    }

    drawLineNumbers() {
        const { lineHeight } = this.state;
        let lines = Math.floor(this.getLineCount());
        if (!lines) {
            lines = 1;
        }

        return [...Array(lines).keys()].map(index => (
            <div
                key={index}
                style={{ height: lineHeight }}
                className={style.vcenter}
            >
                <span>{index + 1}</span>
            </div>
        ));
    }

    adjustGutterPosition() {
        this.gutter.current.scrollTop = this.editor.current.scrollTop;
    }

    render() {
        const { disabled, placeholder } = this.props;
        const { editorValue, lineHeight } = this.state;
        return (
            <div className={style["editor-container"]}>
                <div className={style.numbers} ref={this.gutter}>
                    {this.drawLineNumbers()}
                </div>
                <div className={style.expand}>
                    <textarea
                        ref={this.editor}
                        value={editorValue}
                        style={{
                            lineHeight: `${lineHeight}px`,
                            opacity: disabled ? 0.2 : 1
                        }}
                        className={style["editor-area"]}
                        onKeyDown={ev => this.onEditorKeyDown(ev)}
                        onChange={() => this.onEditorChange()}
                        onScroll={() => this.onEditorScroll()}
                        disabled={disabled}
                        placeholder={placeholder}
                    />
                </div>
            </div>
        );
    }

};

export { CodeEditor };
