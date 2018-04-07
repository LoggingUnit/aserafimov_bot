import React, { Component } from 'react'
import './style.css'

class PopularRequestsSingleRow extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isOpen: props.defaultOpen
        }
    }

    componentWillReceiveProps(nextProps) {
    }

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