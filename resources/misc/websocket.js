const interval = 5;

/**
 * @description
 * Versucht eine Websocket-Verbindung mit OBS herzustellen (rekursiv bis es funktioniert)
 * 
 * Tries to create a websocket connection with obs (recursively until it works)
 * 
 * @author ItsLeMax
 * 
 * @returns
 * Websocket bei Erfolg
 * 
 * websocket on success
 */
function connectWithSocket() {
    const OBS_SOCKET = new WebSocket("ws://localhost:4460");

    OBS_SOCKET.addEventListener("close", () => {
        console.warn(
            `Konnte keine Verbindung mit dem OBS-Websocket herstellen. Erneuter Versuch in ${interval} Sekunden...` + "\n" +
            `Couldn't connect with the OBS web socket. Trying again in ${interval} seconds...`
        );
        setTimeout(() => {
            connectWithSocket();
        }, interval * 1000);
    })

    return OBS_SOCKET;
}