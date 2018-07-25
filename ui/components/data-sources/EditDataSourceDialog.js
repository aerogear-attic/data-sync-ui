import { graphql } from "react-apollo";

import BaseDataSourceDialog from "./BaseDataSourceDialog";
import UpdateDataSource from "../../graphql/UpdateDataSource.graphql";
import GetDataSources from "../../graphql/GetDataSources.graphql";

const INITIAL_STATE = {
    id: null,
    name: null,
    type: null,
    options: null,
    err: "",
    validations: {
        name: "success",
        type: "success",
        options: "success"
    }
};

class EditDataSourceDialog extends BaseDataSourceDialog {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    componentDidUpdate(prevProps) {
        if (this.props.dataSource && this.props.dataSource !== prevProps.dataSource) {
            const { id, name, type, config } = this.props.dataSource;


            console.log("data source");
            console.log(this.props.dataSource);


            this.setState({
                ...INITIAL_STATE,
                id,
                name,
                type,
                options: config
            });
        }
    }

    getTitle() {
        return "Edit Data Source";
    }

    getSubmitTitle() {
        return "Edit";
    }

    onSubmit() {
        this.updateDataSource()
            .then(() => this.onClose())
            .catch(({ message = "Error" }) => this.setState({ err: message }));
    }

    updateDataSource() {
        const { id, name, type, options } = this.state;
        return this.props.mutate({
            variables: { id, name, type, config: options },
            refetchQueries: [{ query: GetDataSources }]
        });
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

const EditDataSourceDialogWithMutation = graphql(UpdateDataSource)(EditDataSourceDialog);

export { EditDataSourceDialogWithMutation as EditDataSourceDialog };
