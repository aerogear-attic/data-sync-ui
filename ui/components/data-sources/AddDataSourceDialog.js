import { graphql } from "react-apollo";

import BaseDataSourceDialog from "./BaseDataSourceDialog";
import { DataSourceType } from "../../graphql/types/DataSourceType";
import CreateDataSource from "../../graphql/CreateDataSource.graphql";
import GetDataSources from "../../graphql/GetDataSources.graphql";

const INITIAL_STATE = {
    name: "",
    type: DataSourceType.InMemory,
    options: {
        timestampData: true
    },
    err: "",
    validations: {
        name: null,
        type: "success",
        options: "success"
    }
};

class AddDataSourceDialog extends BaseDataSourceDialog {

    constructor(props) {
        super(props);
        this.state = INITIAL_STATE;
    }

    getTitle() {
        return "Add Data Source";
    }

    onSubmit() {
        this.createDataSource()
            .then(() => this.onClose())
            .catch(({ message = "Error" }) => this.setState({ err: message }));
    }

    createDataSource() {
        const { name, type, options } = this.state;

        const config = JSON.stringify({ options });

        return this.props.mutate({
            variables: { name, type, config },
            refetchQueries: [{ query: GetDataSources }]
        });
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

const AddDataSourceDialogWithMutation = graphql(CreateDataSource)(AddDataSourceDialog);

export { AddDataSourceDialogWithMutation as AddDataSourceDialog };
