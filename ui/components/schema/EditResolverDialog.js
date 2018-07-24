import BaseResolverDialog from "./BaseResolverDialog";

const INITIAL_STATE = {
    dataSourceName: null,
    requestmapping: null,
    responseMapping: null,
    err: "",
    validations: {
        name: "success",
        requestmapping: "success",
        responseMapping: "success"
    }
};

class EditResolverDialog extends BaseResolverDialog {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentDidUpdate(prevProps) {
        if (this.props.dataSource && this.props.dataSource !== prevProps.dataSource) {
            const { id, name, type, config } = this.props.dataSource;
            this.setState({
                ...INITIAL_STATE,
                id,
                name,
                type,
                options: config.options
            });
        }
    }

    getTitle() {
        return "Edit Resolver";
    }

    getSubmitTitle() {
        return "Edit";
    }

    onSubmit() {
        this.updateResolver()
            .then(() => this.onClose())
            .catch(({ message = "Error" }) => this.setState({ err: message }));
    }

    updateResolver() {
        console.log("called the update resolver function");
    }

    clearForms() {
        // Don't reset state
    }

    isDisabled(controlId) {
        switch (controlId) {
            case "type":
                return true;
            default:
                return false;
        }
    }

    render() {
        return super.render();
    }

}

export { EditResolverDialog };
