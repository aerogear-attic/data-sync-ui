import React, { Component } from "react";
import {
    Row,
    Col
} from "patternfly-react";
import { formatType } from "../../../helper/GraphQLFormatters";

import styles from "../ResolversListItem.css";

class CustomTypeArgs extends Component {

    componentWillReceiveProps(nextProps) {
        const { resolver, onClick } = this.props;

        // Close resolver editor when associated resolver does not exist
        if (resolver && !nextProps.resolver) {
            onClick(null);
        }
    }

    render() {
        const {
            resolverItemRow, itemName, itemType, headingResolverSet,
            headingResolverUnset
        } = styles;
        const { field, onClick, resolver, schemaId, type } = this.props;

        return (
            <React.Fragment>
                <Row className={resolverItemRow}>
                    <Col xs={5} className={itemName}>{field.name}</Col>
                    <Col xs={3} className={itemType}>{formatType(field.type)}</Col>
                    <Col xs={4}>
                        <div className={resolver ? headingResolverSet : headingResolverUnset}>
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={() => onClick({ schemaId, type, field: field.name, ...resolver })}
                                onKeyDown={() => onClick({ schemaId, type, field: field.name, ...resolver })}
                            >{resolver ? resolver.DataSource.name : "no resolver set"}
                            </span>
                        </div>
                    </Col>
                </Row>
            </React.Fragment>
        );
    }

}

export { CustomTypeArgs };
