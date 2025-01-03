const fileNames = ["record", "replay", "stream", "replay-record", "stream-record", "stream-replay", "stream-replay-record"];

document.addEventListener("DOMContentLoaded", () => {
    const websocket = new WebSocket("ws://localhost:4460");

    websocket.addEventListener("message", (message) => {
        const image = document.getElementsByTagName("img")[0];
        const data = JSON.parse(message.data);
        const active = new Array;

        for (const key of Object.keys(data)) {
            if (data[key]) {
                active.push(key);
            }
        }

        for (const fileName of fileNames) {
            if (JSON.stringify(active.slice().sort()) == JSON.stringify(fileName.split("-").sort())) {
                image.src = `../img/${fileName}.png`;
                return;
            }
        }

        image.src = `../img/transparent.png`;
    })
})