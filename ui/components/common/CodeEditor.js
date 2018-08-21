import React, { Component, createRef } from "react";

import style from "./codeEditor.css";

const CodeEditor = class extends Component {

    constructor(props) {
        super(props);

        this.editor = createRef();
        this.gutter = createRef();
        this.cursorPositionAfterTabPress = null;
    }

    // Deal with the tab key: we don't want to loose focus on the
    // textarea but insert a tab character instead
    onEditorKeyDown(event) {
        const editor = this.editor.current;
        if (event.keyCode === 9) {
            event.preventDefault();
            const { selectionStart, selectionEnd, value } = editor;
            this.cursorPositionAfterTabPress = selectionStart;

            // When the user presses tab we prevent the default propagation, so we need to udpate
            // the state manually here
            this.props.onChange(`${value.substring(0, selectionStart)}\t${value.substring(selectionEnd)}`);
        }
    }

    componentDidUpdate() {
        if (this.cursorPositionAfterTabPress !== null) {
            this.updateCursorPosition(this.cursorPositionAfterTabPress + 1);
            this.cursorPositionAfterTabPress = null;
        }
    }

    updateCursorPosition(position) {
        const editor = this.editor.current;
        editor.selectionStart = position;
        editor.selectionEnd = position;
    }

    onEditorScroll() {
        this.adjustGutterPosition();
    }

    getLineCount() {
        const { value = "" } = this.props;
        return value.split("\n").length || 1;
    }

    adjustGutterPosition() {
        this.gutter.current.scrollTop = this.editor.current.scrollTop;
    }

    drawLineNumbers() {
        const lines = this.getLineCount();

        return [...Array(lines).keys()].map(index => (
            <div key={index} className={style.vcenter}>
                {index + 1}
            </div>
        ));
    }

    render() {
        const { disabled, placeholder, value, onChange } = this.props;

        return (
            <div className={style["editor-container"]}>
                <div className={style.numbers} ref={this.gutter}>
                    {this.drawLineNumbers()}
                </div>
                <div className={style.expand}>
                    <textarea
                        ref={this.editor}
                        value={value}
                        style={{ opacity: disabled ? 0.2 : 1 }}
                        className={style["editor-area"]}
                        onKeyDown={ev => this.onEditorKeyDown(ev)}
                        onChange={ev => onChange(ev.currentTarget.value)}
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
