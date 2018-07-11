import React, { Component, createRef } from "react";

import style from "./codeEditor.css";

const CodeEditor = class extends Component {

    constructor(props) {
        super(props);

        const { value, initialHeight, lineHeight } = this.props;

        this.state = {
            width: 0,
            editorValue: value,
            height: initialHeight || 0,
            lineHeight: lineHeight || 20
        };

        this.editor = createRef();
        this.gutter = createRef();
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateEditorDimensions.bind(this));
        this.updateEditorDimensions();
        this.drawLineNumbers();
    }

    onEditorChange() {
        this.updateEditorDimensions();
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
        }
    }

    onEditorScroll() {
        this.adjustGutterPosition();
    }

    updateEditorDimensions() {
        const { clientWidth, scrollHeight } = this.editor.current;
        const { initialHeight } = this.props;

        const width = clientWidth;
        const height = scrollHeight || initialHeight;
        this.setState({ width, height });
    }

    drawLineNumbers() {
        const { height, lineHeight } = this.state;
        const lines = Math.floor(height / lineHeight);
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
                        style={{ lineHeight: `${lineHeight}px` }}
                        className={style["editor-area"]}
                        onKeyDown={ev => this.onEditorKeyDown(ev)}
                        onChange={() => this.onEditorChange()}
                        onScroll={() => this.onEditorScroll()}
                    />
                </div>
            </div>
        );
    }

};

export { CodeEditor };
