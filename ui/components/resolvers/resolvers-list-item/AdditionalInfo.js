import React, { Component } from "react";

import { headingResolverSet, headingResolverUnset } from "../ResolversListItem.css";

class AdditionalInfo extends Component {

    componentWillReceiveProps(nextProps) {
        const { resolver, onClick } = this.props;

        // Close resolver editor when associated resolver does not exist
        if (resolver && !nextProps.resolver) {
            onClick(null);
        }
    }

    onResolverClick(clickEvent) {
        const { resolver, onClick, schemaId, type, field } = this.props;
        clickEvent.stopPropagation();
        onClick({ schemaId, type, field, ...resolver });
    }

    render() {
        const { resolver, field } = this.props;

        return (
            <div className={resolver ? headingResolverSet : headingResolverUnset}>
                <span
                    role="button"
                    tabIndex={0}
                    onClick={e => this.onResolverClick(e)}
                    onKeyDown={e => this.onResolverClick(e)}
                    key={field}
                >{resolver ? resolver.DataSource.name : "no resolver set"}
                </span>
            </div>
        );
    }

}

export { AdditionalInfo };
