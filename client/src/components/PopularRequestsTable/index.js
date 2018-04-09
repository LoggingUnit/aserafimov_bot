import React from 'react'
import PopularRequestsSingleRow from '../PopularRequestsSingleRow'
import './style.css'

/**
 * Component builds popular requests table according to received data
 * @param {Object[]} param0 array of requests to display 
 */
export default function PopularRequestsTable({ requests }) {
    const rowElements = requests.map((request, index) =>
        <PopularRequestsSingleRow request={request} key={request._id.text} />
    )
    return (
        <div>
            <h4>
                Top requests:
            </h4>
            <div className="table-responsive table-height">
                <table className='table'>
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
            </div>
        </div>
    )
}