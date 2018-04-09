import React, { Component } from 'react'
import IncomingMessagesTable from '../IncomingMessagesTable'
import PopularRequestsTable from '../PopularRequestsTable'
import ButtonsPanel from '../ButtonsPanel'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

/**
 * Main page component, keeps messages and popular requests as state
 */
class App extends Component {
    state = {
        messages: [],
        requests: []
    }

    /**
     * As soon as component mounted GET request performed to get popular requests from server
     */
    componentDidMount() {

        fetch('/getRequestsPopular')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    requests: result,
                })
            })
            .catch(error => console.log(error))
    }

    render() {
        const { messages, requests } = this.state;
        return (
            <div className='container'>
                <div className='row'>
                    <h1 className='display-4'>
                        Bot`s admin page
                    </h1>
                </div>
                <ButtonsPanel handleClick={this.setMessageAsPerInterval} />
                <div className='row mt-4'>
                    <div className="col-sm-8">
                        <IncomingMessagesTable messages={messages} />
                    </div>
                    <div className="col-sm-4">
                        <PopularRequestsTable requests={requests} />
                    </div>
                </div>
            </div>
        )
    }

    /**
     * Method sets received messages into App state to render components accordingly
     * @param {Object[]} messages array of objects represents input users messages
     */
    setMessageAsPerInterval = (messages) => this.setState({ messages })
}

export default App