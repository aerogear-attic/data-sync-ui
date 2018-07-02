import React from "react";
import ReactDOM from "react-dom";
import { Masthead, Nav, NavItem, TabContent, TabPane, TabContainer } from "patternfly-react";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import DataSourcesView from "./components/DataSourcesView";

const App = () => {
    const client = new ApolloClient({
       uru: "/graphql"
    });

    return (
        <ApolloProvider client={client}>
            <div>
                <Masthead
                    iconImg="img/logo.png"
                    title="AeroGear Sync"
                    navToggle={false}>
                </Masthead>
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
                                <TabPane>
                                    <DataSourcesView/>
                                </TabPane>

                            </TabContent>
                        </div>
                    </TabContainer>
                </div>
            </div>
        </ApolloProvider>
    );
};


ReactDOM.render(<App />, document.getElementById("app"));
