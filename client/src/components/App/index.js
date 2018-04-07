import React, { Component } from 'react'
import ArticleList from '../ArticleList'
import IncomingMessagesTable from '../IncomingMessagesTable'
import PopularRequestsTable from '../PopularRequestsTable'
import articles from '../../fixtures'
import 'bootstrap/dist/css/bootstrap.css'
import './style.css'

class App extends Component {
    state = {
        messages: [],
        requests: []
    }

    componentDidMount() {
        fetch('/getAll')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    messages: result,
                })
            })
            .catch(error => {
                this.setState({
                    messages: [],
                })
            })

        fetch('/getPopularRequests')
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
                <div className='jumbotron'>
                    <h1 className='display-4'>
                        <div className='row'>
                            Bot`s admin page
                        </div>
                        {/* <button className='btn' onClick={this.revert}>Revert</button> */}
                    </h1>
                </div>
                {/* <ArticleList articles={this.state.reverted ? articles.reverse() : articles} /> */}
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

    revert = () => this.setState({
        reverted: !this.state.reverted
    })
}

export default App