import React, { Component } from 'react'
import './style.css'

class IncomingMessagesSingleRow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: props.defaultOpen
        }
    }

    componentWillReceiveProps(nextProps) {
    }

    render() {
        const { message } = this.props;
        return (
            <tr className = "incomingMessagesSingleRow">
                <td>
                    {message.chat.first_name}
                </td>
                <td>
                    {message.text}
                </td>
                <td>
                    {(new Date(message.date*1000)).toString()}
                </td>
            </tr>
        )
    }
}

export default IncomingMessagesSingleRow