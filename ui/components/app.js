import React from "react";
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
import { QueriesContainer } from "./queries";
import { ResolversContainer } from "./resolvers";

import { header, tabs } from "./App.css";

const App = () => (
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
                    </TabContent>
                </div>
            </TabContainer>
        </div>
    </div>
);

export default App;
