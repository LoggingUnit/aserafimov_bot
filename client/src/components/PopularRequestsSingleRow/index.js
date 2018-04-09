import React, { Component } from 'react'
import './style.css'

/**
 * Component creates a single row of popular message table
 */
class PopularRequestsSingleRow extends Component {

    /**
     * Render recieves single request as props from parent component to provide ability to 
     * crate single row with appropriate data
     */
    render() {
        const { request } = this.props;
        return (
            <tr>
                <td>
                    {request._id.text}
                </td>
                <td>
                    {request.count}
                </td>
            </tr>
        )
    }
}

export default PopularRequestsSingleRow