import React from 'react'
import IncomingMessagesSingleRow from '../IncomingMessagesSingleRow'
import './style.css'

/**
 * Component builds incoming message table according to received data
 * @param {Object[]} param0 array of messages to display 
 */
export default function IncomingMessagesTable({ messages }) {
    const rowElements = messages.map((message, index) =>
        <IncomingMessagesSingleRow message={message} key={message._id} />
    )
    return (
        <div>
            <h4>
                Incoming messages log:
            </h4>
            <div className="table-responsive table-height">
                <table className='table'>
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
            </div>
        </div>
    )
}