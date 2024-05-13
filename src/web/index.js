document.addEventListener("DOMContentLoaded", () => {
    const OBS_SOCKET = new WebSocket("ws://localhost:4455");

    for (const button of document.getElementsByTagName("button")) {
        button.addEventListener("click", () => {
            OBS_SOCKET.send(JSON.stringify(button.id));
        })
    }
})