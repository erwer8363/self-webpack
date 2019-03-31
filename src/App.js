import React, { Component } from 'react'
import './App.scss'

import Home from '@/home/index'

class App extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        return (
            <Home/>
        )
    }
}

export default App