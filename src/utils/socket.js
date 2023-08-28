import constants from '../constants';
import * as io from "socket.io-client";
import process from 'process';
const socket = io.connect('192.168.1.21:4009', {
    reconnection: true
});
var w;
var h;
socket.once(constants.SCREEN_SIZE, ({ wi, he }) => {
    w = wi;
    h = he;
});
socket.on(constants.SCREEN_DATA, ({ screen, dim }) => {
    document.getElementById('remoteControlScreen').src = "data:image/png;base64," + screen;
    document.getElementById('remoteControlScreen').setAttribute("width", window.innerWidth);
    document.getElementById('remoteControlScreen').setAttribute("height", window.innerHeight);
});


const sockets = {
    mouseMove(payload) {
        socket.emit(constants.MOUSE_MOVE, payload);
    },
    keyPress(payload) {
        socket.emit(constants.KEY_PRESS, payload);
    },
    mouseClick(payload) {
        socket.emit(constants.MOUSE_CLICK, payload);
    },
    getScreen(payload) {
        socket.emit(constants.GET_SCREEN, payload);
        console.log("sent");
    },
    keyDown(payload) {
        socket.emit(constants.KEY_DOWN, payload);
    },
    keyUp(payload) {
        socket.emit(constants.KEY_UP, payload);
    }
}


export default sockets;