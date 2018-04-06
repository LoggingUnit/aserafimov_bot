import React, { Component } from 'react'
import ArticleList from './ArticleList'
import IncomingMessagesTable from './IncomingMessagesTable'
import articles from '../fixtures'
import 'bootstrap/dist/css/bootstrap.css'

class App extends Component {
    state = {
        reverted: false,
        messages: [],
        loaded: false
    }

    componentDidMount() {
        fetch('/getAll')
            .then(response => response.json())
            .then(result => {
                this.setState({
                    messages: result,
                    loaded: true,
                })
            })
            .catch(error => {
                this.setState({
                    messages: [],
                    loaded: true,
                })
            })
    }


    render() {
        const { messages, loaded } = this.state;
        return (
            <div className='container'>
                <div className='jumbotron'>
                    <h1 className='display-3'>
                        App name
                        {/* <button className='btn' onClick={this.revert}>Revert</button> */}
                    </h1>
                </div>
                <ArticleList articles={this.state.reverted ? articles.reverse() : articles} />
                <IncomingMessagesTable messages={messages} />
            </div>
        )
    }

    revert = () => this.setState({
        reverted: !this.state.reverted
    })
}

export default App