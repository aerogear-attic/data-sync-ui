import { graphql } from "react-apollo";

import BaseDataSourceDialog from "./BaseDataSourceDialog";
import { DataSourceType } from "../../graphql/types/DataSourceType";
import CreateDataSource from "../../graphql/CreateDataSource.graphql";
import GetDataSources from "../../graphql/GetDataSources.graphql";

const INITIAL_STATE = {
    name: "",
    type: DataSourceType.InMemory,
    inMemoryOptions: {
        timestampData: true
    },
    postgresOptions: {
        host: "",
        port: "5432",
        database: "",
        user: "",
        password: ""
    },
    err: "",
    validations: {
        name: null,
        type: "warning",
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

    getSubmitTitle() {
        return "Add";
    }

    onSubmit() {
        this.createDataSource()
            .then(() => this.onClose())
            .catch(({ message = "Error" }) => this.setState({ err: message }));
    }

    createDataSource() {
        const { name, type } = this.state;

        const config = { options: this.getConfigByType(type) };
        const { filter } = this.props;

        return this.props.mutate({
            variables: { name, type, config },
            refetchQueries: [
                { query: GetDataSources,
                    variables: { name: filter.name } },
                { query: GetDataSources }]
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
