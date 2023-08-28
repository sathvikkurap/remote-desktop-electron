const Jimp = require('jimp');
const constants = require('./constants');
const fs = require("fs");
const path = require("path");
const sizeOf = require("buffer-image-size")
const screenshot = require('screenshot-desktop');
function handleSocketEvents(socket, robot) {
    var scr = robot.getScreenSize();
    var w = scr.width;
    var h = scr.height;
    socket.emit(constants.SCREEN_SIZE, { width: w, height: h });
    socket.on(constants.KEY_DOWN, ({ key }) => {
        var cont = true;
        if (key.startsWith("Arrow")) {
            key = key.substring(5);
        }
        if (key.startsWith("Page")) {
            if (key == "PageUp") {
                key = "pageup";
            }
            if (key == "PageDown") {
                key = "pagedown";
            }
        }
        if (key == "Pause") {
            key = "audio_pause";
        }
        if (key == "CapsLock") {
            key = "capslock";
        }
        if (key == "Meta" || key == "ContextMenu" || key == "*" || key == "add" || key == "subtract" || key == "decimal") {
            cont = false;
        }
        key = key.toLowerCase();
        if (cont) {
            console.log(key + " down")
            robot.keyToggle(key, 'down')
        }
    })
    socket.on(constants.KEY_UP, ({ key }) => {
        var cont = true;
        if (key.startsWith("Arrow")) {
            key = key.substring(5);
        }
        if (key.startsWith("Page")) {
            if (key == "PageUp") {
                key = "pageup";
            }
            if (key == "PageDown") {
                key = "pagedown";
            }
        }
        if (key == "Pause") {
            key = "audio_pause";
        }
        if (key == "CapsLock") {
            key = "capslock";
        }
        if (key == "Meta" || key == "ContextMenu" || key == "*" || key == "add" || key == "subtract" || key == "decimal") {
            cont = false;
        }
        key = key.toLowerCase();
        if (cont) {
            console.log(key + " up");
            robot.keyToggle(key, 'up')
        }
    })
    socket.on(constants.MOUSE_MOVE, ({ x, y, scroll }) => {
        if (!scroll) {

            x = (x) * w;
            y = (y) * h;
            robot.moveMouse(x, y);
        } else {
            y = y > 0 ? 1 : -1;
            robot.scrollMouse(0, y);
        }
    });

    socket.on(constants.MOUSE_CLICK, ({ button, double }) => {
        console.log('click', button, double);
        robot.mouseClick(button, double);
    });
    interval = setInterval(function () {
        screenshot().then((img) => {

            let dimension = sizeOf(img)

            var imgStr = new Buffer.from(img).toString('base64');

            var obj = {};

            obj.image = imgStr;
            obj.dimension = dimension
            socket.emit(constants.SCREEN_DATA, { screen: obj.image, dim: obj.dimension });
        })
    }, 163);
}
module.exports = handleSocketEvents;