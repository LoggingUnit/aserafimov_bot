import React from 'react'
import IncomingMessagesSingleRow from '../IncomingMessagesSingleRow'
import './style.css'

export default function IncomingMessagesTable({ messages }) {
    const rowElements = messages.map((message, index) =>
        <IncomingMessagesSingleRow message={message} key={message._id} />
    )
    return (
        <table className ='incomingMessagesTable'>
            <tr>
                <th>
                    User
                </th>
                <th>
                    Request
                </th>
                <th>
                    Date
                </th>
            </tr>
            {rowElements}
        </table>
    )
}