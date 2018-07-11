import React, {Component, createRef} from "react";

import style from "./codeEditor.css";

const CodeEditor = class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: 0,
            editorValue: this.props.value,
            height: this.props["initialHeight"] || 0,
            lineHeight: this.props.lineHeight || 20
        };

        this.editor = createRef();
        this.gutter = createRef();
    }

    componentDidMount() {
        window.addEventListener("resize", this.updateEditorDimensions.bind(this));
        this.updateEditorDimensions();
        this.drawLineNumbers();
    }

    updateEditorDimensions() {
        const width = this.editor.current.clientWidth;
        const height = this.editor.current.scrollHeight || this.state.height;
        this.setState({width, height});
    }

    onEditorChange() {
        const value = this.editor.current.value;
        this.updateEditorDimensions();
        this.drawLineNumbers();
        this.setState({
            editorValue: value
        });

        // Propagate update
        this.props.onChange && this.props.onChange(value);
    }

    // Deal with the tab key: we don't want to loose focus on the
    // textarea but insert a tab character instead
    onEditorKeyDown(event) {
        const editor = this.editor.current;
        if (event.keyCode === 9) {
            event.preventDefault();
            const start = editor.selectionStart;
            const end = editor.selectionEnd;
            const value = editor.value;
            editor.value = value.substring(0, start) + "\t" + value.substring(end);
            editor.selectionStart = editor.selectionEnd = start + 1;
        }
    }

    onEditorScroll() {
        this.adjustGutterPosition();
    }

    drawLineNumbers() {
        const {height, lineHeight} = this.state;
        const lines = Math.floor(height / lineHeight);
        return [...Array(lines).keys()].map(index => {
            return (
                <div
                    key={index}
                    style={{height: this.state.lineHeight}}
                    className={style.vcenter}>
                    <span>{index + 1}</span>
                </div>
            );
        });
    }

    adjustGutterPosition() {
        this.gutter.current.scrollTop = this.editor.current.scrollTop;
    }

    render() {
        return (
            <div className={style["editor-container"]}>
                <div className={style.numbers} ref={this.gutter}>
                    {this.drawLineNumbers()}
                </div>
                <div className={style.expand}>
                    <textarea
                        autoFocus={true}
                        ref={this.editor}
                        value={this.state.editorValue}
                        style={{lineHeight: this.state.lineHeight + "px"}}
                        className={style["editor-area"]}
                        onKeyDown={ev => this.onEditorKeyDown(ev)}
                        onChange={() => this.onEditorChange()}
                        onScroll={() => this.onEditorScroll()}>
                    </textarea>
                </div>
            </div>
        );
    }
};

export {CodeEditor};