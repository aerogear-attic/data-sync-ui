import React from "react";
import {
    ListView,
    DropdownKebab,
    MenuItem
} from "patternfly-react";

const DataSourcesListItem = ({ item }) => {
    const { type, name } = item;

    return (
        <ListView.Item
            className="ds-list-item"
            heading={type}
            description="---"
            leftContent={(
                <span className="list-item-name">{name}</span>
            )}
            actions={(
                <div>
                    <DropdownKebab id="data-source-list-item-dropdown" pullRight>
                        <MenuItem>
                            Action
                        </MenuItem>
                        <MenuItem>
                            Another Action
                        </MenuItem>
                        <MenuItem divider />
                        <MenuItem>
                            Separated link
                        </MenuItem>
                    </DropdownKebab>
                </div>
            )}
        />
    );
};

export { DataSourcesListItem };
