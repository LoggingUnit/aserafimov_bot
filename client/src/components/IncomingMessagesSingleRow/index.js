import React, { Component } from 'react'
import './style.css'

/**
 * Component creates a single row of incoming message table
 */
class IncomingMessagesSingleRow extends Component {

    /**
     * Render recieves single message as props from parent component to provide ability to 
     * crate single row with appropriate data
     */
    render() {
        const { message } = this.props;
        return (
            <tr>
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