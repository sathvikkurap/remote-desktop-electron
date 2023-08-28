import React, { Component } from 'react';
import { throttle } from 'lodash';
import socket from '../utils/socket';
const buttons = {
    0: 'left',
    1: 'right'
}
function capitalizeFirstLetter(string) {
    return string.charAt(0).toLowerCase() + string.slice(1);
}
class Home extends Component {
    constructor(props) {
        super(props);
        this.lastX = null;
        this.lastY = null;
        this.timeOut = null;
        this.handleTouchMove = throttle(this.handleTouchMove, 10);
        this.componentDidMount = this.componentDidMount.bind(this);
    }
    handleMouseEnter = ({ clientX, clientY }) => {
        this.lastX = clientX;
        this.lastY = clientY;
    }
    handleMouseMove = ({ clientX, clientY }) => {
        this.handleMouse(clientX, clientY);
    }
    handleMouse = (X, Y, scroll) => {
        const x = (X) / window.innerWidth;
        const y = (Y) / window.innerHeight;
        this.lastX = X;
        this.lastY = Y;
        socket.mouseMove({ x, y, scroll });
    }
    handleTouchStart = event => {
        event.persist();
        const touchPos = event.touches[0];
        this.lastX = touchPos.clientX;
        this.lastY = touchPos.clientY;
        clearTimeout(this.timeOut);
        this.timeOut = setTimeout(() => event.preventDefault(), 100);
    }

    handleTouchEnd = () => {
        clearTimeout(this.timeOut);
    }
    handleTouchMove = event => {
        event.preventDefault();
        let touchPos = event.touches[0];
        const isScroll = event.touches.length > 1;
        this.handleMouse(touchPos.clientX, touchPos.clientY, isScroll);
    }
    handleClick = event => {
        socket.mouseClick({ button: buttons[event.button], double: false });
    }
    handleDoubleClick = event => {
        socket.mouseClick({ button: buttons[event.button], double: true });
    }
    handleClickBtn = btn => {
        socket.mouseClick({ button: btn, double: true });
    }
    handleKeyDown = event => {
        var k = event.key;
        console.log(k + " down");
        socket.keyDown({ key: k });
    }
    handleKeyUp = event => {
        var k = event.key;
        console.log(k + " down");
        socket.keyUp({ key: k });
    }

    componentDidMount() {
        document.addEventListener('keyup', this.handleKeyUp);
        document.addEventListener('keydown', this.handleKeyDown);
        console.log("listening");
    }




    render() {
        return (
            <React.Fragment>

                <div className="home-container">
                    <div className="touch-container"
                        onMouseEnter={this.handleMouseEnter}
                        onMouseMove={this.handleMouseMove}
                        onTouchStart={this.handleTouchStart}
                        onTouchEnd={this.handleTouchEnd}
                        onTouchMove={this.handleTouchMove}
                        onDoubleClick={this.handleDoubleClick}
                        onClick={this.handleClick}
                        onKeyUp={this.handleKeyUp}
                        onKeyDown={this.handleKeyDown}

                    >
                        <img id="remoteControlScreen"></img>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}

export default Home;