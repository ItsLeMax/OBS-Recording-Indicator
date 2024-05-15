document.addEventListener("DOMContentLoaded", () => {
    const websocket = new WebSocket("ws://localhost:4460");

    for (const button of document.getElementsByTagName("button")) {
        button.addEventListener("click", () => {
            websocket.send(JSON.stringify(button.id));
        })
    }
})