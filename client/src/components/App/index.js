import React, { Component } from 'react'
import ArticleList from '../ArticleList'
import IncomingMessagesTable from '../IncomingMessagesTable'
import PopularRequestsTable from '../PopularRequestsTable'
import ButtonsPanel from '../ButtonsPanel'
import articles from '../../fixtures'
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
                <div className='row'>
                    <div className="col-sm-8">
                        <div className="table-responsive table-height">
                            <IncomingMessagesTable messages={messages} />
                        </div>
                    </div>
                    <div className="col-sm-4">
                        <div className="table-responsive table-height">
                            <PopularRequestsTable requests={requests} />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    setMessageAsPerInterval = (messages) => this.setState({ messages })
}

export default App