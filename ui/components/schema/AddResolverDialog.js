import BaseResolverDialog from "./BaseResolverDialog";

const INITIAL_STATE = {
    dataSourceName: "",
    requestmapping: "",
    responseMapping: "",
    err: "",
    validations: {
        name: null,
        requestmapping: "warning",
        responseMapping: "success"
    }
};

class AddResolverDialog extends BaseResolverDialog {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    getTitle() {
        return "Add Resolver";
    }

    getSubmitTitle() {
        return "Add";
    }

    onSubmit() {
        this.createResolver()
            .then(() => this.onClose())
            .catch(({ message = "Error" }) => this.setState({ err: message }));
    }

    createResolver() {
        console.log("called create resolver");
    }

    clearForms() {
        this.setState(INITIAL_STATE);
    }

    isDisabled() {
        return false;
    }

    render() {
        return super.render();
    }

}

export { AddResolverDialog };
