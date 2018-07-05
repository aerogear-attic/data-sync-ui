import React from "react";
import {
    Masthead,
    Nav,
    NavItem,
    TabContent,
    TabPane,
    TabContainer
} from "patternfly-react";
import DataSourcesView from "./data-source/DataSourcesView";

const App = () => (
    <div>
        <Masthead iconImg="img/logo.png" title="AeroGear Sync" navToggle={false} />
        <div>
            <div className="ag-header">
                <p>My Data Sync API</p>
            </div>
            <TabContainer id="basic-tabs">
                <div>
                    <Nav bsClass="nav nav-tabs">
                        <NavItem disabled={false}>
                            <div>Data Sources</div>
                        </NavItem>
                    </Nav>
                    <TabContent>
                        <TabPane><DataSourcesView /></TabPane>
                    </TabContent>
                </div>
            </TabContainer>
        </div>
    </div>
);

export default App;
