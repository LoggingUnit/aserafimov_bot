import React, { Component } from 'react'
import './style.css'

class ButtonsPanel extends Component {
    constructor(props) {
        super(props)
        const { handleClick } = this.props;
    }

    componentDidMount () {
        this.buttonClicked();
    }

    render() {
        const { handleClick } = this.props;
        return (
            <div className="d-flex justify-content-start align-items-center">
                <div>
                    Select time interval:
            </div>
                <div>
                    <button
                        className='btn ml-2'
                        onClick={() => this.buttonClicked(1)}>
                        1 day
                    </button>
                </div>
                <div>
                    <button
                        className='btn ml-2'
                        onClick={() => this.buttonClicked(3)}>
                        3 day
                    </button>
                </div>
                <div>
                    <button
                        className='btn ml-2'
                        onClick={() => this.buttonClicked(7)}>
                        Week
                    </button>
                </div>
                <div>
                    <button
                        className='btn ml-2'
                        onClick={() => this.buttonClicked()}>
                        All
                    </button>
                </div>
            </div>
        )
    }

    buttonClicked (arg) {
        console.log(arg);
        fetch(`/getRequestsByInterval/${arg}`)
            .then(response => response.json())
            .then(result => {
                this.props.handleClick(result);
            })
            .catch(error => {
                this.props.handleClick(error);
            })
    }

}

export default ButtonsPanel