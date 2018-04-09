import React, { Component } from 'react'
import './style.css'

/**
 * Buttons page component 
 */
class ButtonsPanel extends Component {

    /**
     * Constructor recieves handleClick function from parent component to provide ability to 
     * render different sets of messages by button click
     */
    constructor(props) {
        super(props)
        const { handleClick } = this.props;
    }

    /**
     * As soon as component mounted buttonClicked method emitted to get messages and render components
     */
    componentDidMount() {
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

    /**
     * Method performs GET request to server and in case of success calls handleClick callback
     * to set received data to parent component
     * @param {string} arg number of last days to display data within
     */
    buttonClicked(arg) {
        console.log(arg);
        fetch(`/getRequestsByInterval/${arg}`)
            .then(response => response.json())
            .then(result => {
                this.props.handleClick(result);
            })
            .catch(error => {
                console.log(error);
            })
    }

}

export default ButtonsPanel