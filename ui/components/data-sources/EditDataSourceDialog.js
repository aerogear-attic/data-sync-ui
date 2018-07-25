import { graphql } from "react-apollo";

import BaseDataSourceDialog from "./BaseDataSourceDialog";
import UpdateDataSource from "../../graphql/UpdateDataSource.graphql";
import GetDataSources from "../../graphql/GetDataSources.graphql";
import { DataSourceType } from "../../graphql/types/DataSourceType";

const INITIAL_STATE = {
    id: null,
    name: null,
    type: null,
    inMemoryOptions: null,
    postgresOptions: null,
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

            const newState = {
                ...INITIAL_STATE,
                id,
                name,
                type
            };

            if (type === DataSourceType.InMemory) {
                newState.inMemoryOptions = config.options;
            } else {
                newState.postgresOptions = config.options;
            }

            this.setState(newState);
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
        const { id, name, type } = this.state;
        const config = { options: this.getConfigByType(type) };
        return this.props.mutate({
            variables: { id, name, type, config },
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
