const { default: OBSWebSocket } = require("obs-websocket-js");
const { app, BrowserWindow } = require("electron");
const WebSocket = require("ws");
const path = require("path");

app.whenReady().then(() => {
    app.applicationMenu = null;

    const settingsPanel = new BrowserWindow({
        height: 400,
        width: 600,
        frame: false,
        resizable: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, "../../../resources/obs-inverted.png")
    });

    settingsPanel.loadFile("../web/index.html");

    const overlay = new BrowserWindow({
        frame: false,
        resizable: false,
        fullscreen: true,
        transparent: true,
        webPreferences: {
            backgroundThrottling: false
        },
        icon: path.join(__dirname, "../../../resources/layers.png")
    });

    overlay.loadFile("../../../overlay/web/overlay.html");
    overlay.setAlwaysOnTop(true, "normal");
    overlay.setIgnoreMouseEvents(true);

    settingsPanel.on("closed", () => app.quit());
    overlay.on("closed", () => app.quit());

    let webSocket;
    new WebSocket.Server({ port: "4460" }).on("connection", (socket) => {
        webSocket = socket.on("message", (message) => {
            switch (JSON.parse(message)) {
                case "close":
                    app.quit();
                    break;
                case "minimize":
                    settingsPanel.minimize();
                    break;
                case "restart":
                    app.relaunch();
                    app.quit();
                    break;
            }
        })
    })

    const obs = new OBSWebSocket();
    connectWithOBS();

    const events = {
        rsc: "record",
        rbsc: "replay",
        ssc: "stream"
    }

    obs.on("StreamStateChanged", (sscEvent) => {
        updateIcon(sscEvent, events.ssc);
    })

    obs.on("RecordStateChanged", (rscEvent) => {
        updateIcon(rscEvent, events.rsc);
    })

    obs.on("ReplayBufferStateChanged", (rbscEvent) => {
        updateIcon(rbscEvent, events.rbsc);
    })

    obs.on("ReplayBufferSaved", (rbsEvent) => {
        // updateIcon(rbsEvent, events.rbs);
    })

    const active = {
        record: false,
        replay: false,
        stream: false
    };

    /**
     * @description
     * Aktualisiert das Icon, entsprechend der aktiven Modi
     * 
     * Updates the icon according to the active modes
     * 
     * @author ItsLeMax
     * 
     * @param data 
     * Daten aus den Events
     * 
     * Data from the events
     * 
     * @see EventEmitter.EventNames<EventTypes>
     * 
     * @param { String } event
     * Event aus dem Objekt `events`
     * 
     * Event from the object `events`
     */
    function updateIcon(data, event) {
        if (data.outputState.endsWith("ING")) return;
        console.log(data);

        active[event] = data.outputState == "OBS_WEBSOCKET_OUTPUT_STARTED";
        webSocket.send(JSON.stringify(active));
    }

    /**
     * @description
     * Verbindet das Websocket mit OBS (rekursiv bis es funktioniert)
     * 
     * Connects the websocket to obs (recursively until it works)
     * 
     * @author ItsLeMax
     */
    async function connectWithOBS() {
        const interval = 3;

        try {
            await obs.connect("ws://192.168.80.1:4455", "UVI8aRGWDQtgdpqP");
        } catch (error) {
            console.warn(
                `Konnte keine Verbindung mit OBS herstellen. Erneuter Versuch in ${interval} Sekunden...` + "\n" +
                `Couldn't connect with OBS. Retrying in ${interval} seconds...`
            );

            setTimeout(() => {
                connectWithOBS();
            }, interval * 1000);

            return;
        }

        console.log("OBS-Verbindung erfolgreich aufgebaut!" + "\n" + "OBS connection successfully built!");
    }
})