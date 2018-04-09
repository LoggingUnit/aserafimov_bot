import React, { Component } from 'react'
import IncomingMessagesTable from '../IncomingMessagesTable'
import PopularRequestsTable from '../PopularRequestsTable'
import ButtonsPanel from '../ButtonsPanel'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

class App extends Component {
    state = {
        messages: [],
        requests: []
    }

    componentDidMount() {

        fetch('/getRequestsPopular')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    requests: result,
                })
            })
            .catch(error => {
                this.setState({
                    requests: [],
                })
            })
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
    setMessageAsPerInterval = (messages) => this.setState({ messages })
}

export default App