document.addEventListener("DOMContentLoaded", () => {
    const websocket = connectWithSocket();
    for (const button of document.getElementsByTagName("button")) {
        button.addEventListener("click", () => {
            websocket.send(JSON.stringify(button.id));
        })
    }
})