import BaseResolverDialog from "./BaseResolverDialog";

const INITIAL_STATE = {
    dataSourceName: null,
    requestMapping: null,
    responseMapping: null,
    err: "",
    validations: {
        name: "success",
        requestMapping: "success",
        responseMapping: "success"
    }
};

class EditResolverDialog extends BaseResolverDialog {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
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
