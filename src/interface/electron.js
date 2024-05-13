const WebSocket = require("ws");
const { app, BrowserWindow } = require("electron");

app.whenReady().then(async () => {
    const interface = new BrowserWindow({
        height: 400,
        width: 600,
        frame: false,
        resizable: false,
        autoHideMenuBar: true
    });

    interface.loadFile("../web/index.html");
    // app.applicationMenu = null;

    // const OBSWebSocket = require('obs-websocket-js').default;
    // const obs = new OBSWebSocket();
    // await obs.connect("ws://localhost:4455");

    // obs.on("ReplayBufferSaved", () => {
    //     console.log(true);
    // });

    new WebSocket.Server({ port: "4455" }).on("connection", (socket) => {
        socket.on('message', (message) => {

            console.log(JSON.parse(message));

            switch (JSON.parse(message)) {
                case "close":
                    app.quit();
                    break;
                case "minimize":
                    interface.minimize();
                    break;
                case "restart":
                    app.relaunch();
                    app.quit();
                    break;
            }
        })
    })
})