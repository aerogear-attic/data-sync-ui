import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { Playground, store } from 'graphql-playground-react'

const QueriesContainer = () => 
    <Provider store={store}>
        <Playground endpoint="http://localhost:8000/graphql" settings={{'editor.theme': 'light'}} />
    </Provider>


export { QueriesContainer };
