import React from 'react'
import PopularRequestsSingleRow from '../PopularRequestsSingleRow'
import './style.css'

export default function PopularRequestsTable({ requests }) {
    const rowElements = requests.map((request, index) =>
        <PopularRequestsSingleRow request={request} key={request._id.text} />
    )
    return (
        <table className = 'table'>
            <tr>
                <th>
                    Request
                </th>
                <th>
                    Count
                </th>
            </tr>
            {rowElements}
        </table>
    )
}