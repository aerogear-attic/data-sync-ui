import React, { Component } from "react";
import { graphql } from "react-apollo";
import {
    Masthead,
    Nav,
    NavItem,
    TabContent,
    TabPane,
    TabContainer
} from "patternfly-react";

import { DataSourcesContainer } from "./data-sources";
import { SchemaContainer } from "./schema";
import { ResolversContainer } from "./resolvers";
import { PlaygroundContainer } from "./playground";

import GetSchema from "../graphql/GetSchema.graphql";

import { header, tabs } from "./App.css";

class App extends Component {

    renderContent() {
        return (
            <div>
                <Masthead iconImg="img/logo.png" title="AeroGear Sync" navToggle={false} />
                <div>
                    <div className={header}>
                        <p>My Data Sync API</p>
                    </div>

                    <TabContainer id="my-data-sync-tabs" defaultActiveKey={0}>
                        <div>
                            {/* Tabs */}
                            <Nav bsClass="nav nav-tabs" className={tabs}>
                                <NavItem eventKey={0}>
                                    <div>Data Sources</div>
                                </NavItem>
                                <NavItem eventKey={1}>
                                    <div>Schema</div>
                                </NavItem>
                                <NavItem eventKey={2}>
                                    <div>Resolvers</div>
                                </NavItem>
                                <NavItem eventKey={3}>
                                    <div>Playground</div>
                                </NavItem>
                            </Nav>
                            {/* Tabs Content */}
                            <TabContent>
                                <TabPane eventKey={0} animation={false}>
                                    <DataSourcesContainer />
                                </TabPane>
                                <TabPane eventKey={1} animation={false}>
                                    <SchemaContainer />
                                </TabPane>
                                <TabPane eventKey={2} animation={false}>
                                    <ResolversContainer />
                                </TabPane>
                                <TabPane eventKey={3} animation={false}>
                                    <PlaygroundContainer {...this.props} />
                                </TabPane>
                            </TabContent>
                        </div>
                    </TabContainer>
                </div>
            </div>
        );
    }

    render() {
        return this.renderContent();
    }

}
// Automatically fetch the default schema
const AppWithQuery = graphql(GetSchema, {
    options: () => ({ variables: { name: "default" } })
})(App);

export { AppWithQuery as App };
