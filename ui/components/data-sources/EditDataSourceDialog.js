import { graphql } from "react-apollo";

import BaseDataSourceDialog from "./BaseDataSourceDialog";
import { DataSourceType } from "../../graphql/types/DataSourceType";
import UpdateDataSource from "../../graphql/UpdateDataSource.graphql";
import GetDataSources from "../../graphql/GetDataSources.graphql";

const INITIAL_STATE = {
    id: "",
    name: "",
    type: DataSourceType.InMemory,
    options: null,
    err: "",
    validations: {
        name: null,
        type: "success",
        options: "success"
    }
};

class EditDataSourceDialog extends BaseDataSourceDialog {

    constructor(props) {
        super(props);
        this.state = { ...INITIAL_STATE, ...props.dataSource };
    }

    componentDidUpdate(prevProps) {
        if (this.props.dataSource !== prevProps.dataSource) {
            this.setState({ ...INITIAL_STATE, ...this.props.dataSource });
        }
    }

    getTitle() {
        return "Edit Data Source";
    }

    onSubmit() {
        this.updateDataSource()
            .then(() => this.onClose())
            .catch(({ message = "Error" }) => this.setState({ err: message }));
    }

    updateDataSource() {
        const { id, name, type, options } = this.state;

        const config = JSON.stringify({ options });

        return this.props.mutate({
            variables: { id, name, type, config },
            refetchQueries: [{ query: GetDataSources }]
        });
    }

    clearForms() {
        // this.setState(INITIAL_STATE);
    }

    isDisabled(controlId) {
        switch (controlId) {
            case "type":
                return true;
            case "timestampData":
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
