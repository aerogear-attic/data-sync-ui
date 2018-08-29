import React, { Component } from "react";

import { headingResolverSet, headingResolverUnset } from "../ResolversListItem.css";

class AdditionalInfo extends Component {

    componentWillReceiveProps(nextProps) {
        const { schemaId, type, field, resolver, onClick } = this.props;

        if (resolver && !nextProps.resolver) {
            onClick({ schemaId, type, field: field.name });
        }
    }

    render() {
        const { resolver, onClick, schemaId, type, field } = this.props;

        return (
            <div className={resolver ? headingResolverSet : headingResolverUnset}>
                <span
                    role="button"
                    tabIndex={0}
                    onClick={() => onClick({ schemaId, type, field, ...resolver })}
                    onKeyDown={() => onClick({ schemaId, type, field, ...resolver })}
                    key={field}
                >{resolver ? resolver.DataSource.name : "no resolver set"}
                </span>
            </div>
        );
    }

}

export { AdditionalInfo };
