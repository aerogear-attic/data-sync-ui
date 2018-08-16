import React from "react";
import {
    ListView,
    DropdownKebab,
    MenuItem
} from "patternfly-react";

import styles from "./DataSourcesListItem.css";

const DataSourcesListItem = ({ item, onEditDataSource, onDeleteDataSource }) => {
    const { type, name } = item;
    const { dsItem, dsItemType, dsItemName } = styles;
    return (
        <ListView.Item
            className={dsItem}
            heading={<span className={dsItemType}>{type}</span>}
            leftContent={(
                <span className={dsItemName}>{name}</span>
            )}
            actions={(
                <div>
                    <DropdownKebab id="data-source-list-item-dropdown" pullRight>
                        <MenuItem onSelect={() => onEditDataSource(item)}>
                            Edit Data Source
                        </MenuItem>
                        <MenuItem onSelect={() => onDeleteDataSource(item)}>
                            Delete Data Source
                        </MenuItem>
                    </DropdownKebab>
                </div>
            )}
        />
    );
};

export { DataSourcesListItem };
