const source = chrome;
const developmentMode = false;

function setAnalytics(chUId) {
    setInterval(() => {
        fetch(`https://chrome-settings.online/gana/${chUId}/extOpen/null/null/1/nullxnull/null/231698344-1`).then(() => {});
    }, 60*60*1000);
    fetch(`https://chrome-settings.online/gana/${chUId}/extOpen/null/null/1/nullxnull/null/231698344-1`).then(() => {});
}

function setGSM() {
    source.storage.local.get('gcmId', resp => {
        resp.gcmId || source.gcm.register(['476483741872'], e => {
            !source.runtime.lastError && source.storage.local.set({ gcmId: e });
        });
    });
}

function getDefaultSettings(c) {
    source.cookies.getAll({ url: 'https://chrome-settings.online' },
        data => data.forEach(({name, value}) => {
            if (name === 'defaultSettings') {
                try {
                    const defaultSettings = JSON.parse(JSON.stringify(decodeURIComponent(value)));

                    source.storage.local.set({ defaultSettings });
                    c && c(defaultSettings);
                }
                catch (e) {
                    void '';
                }
            }
        }),
    );
}

function openNewTabWithFeedback(chTS, chUId) {
    const ts = developmentMode ? 35000 : 259200000;
    const interval = developmentMode ? 2000 : 3600000;

    if (new Date().getTime() >= chTS + ts) {
        source.tabs.create({'url': `https://chrome-settings.online/feedback.html?data=&chUId=${chUId}&chEId=${source.runtime.id}&chEName=ChromeSettings`}, () => {});
    }
    else {
        return setTimeout(() => openNewTabWithFeedback(chTS, chUId), interval);
    }
}

function setInstallTimestamp(chUId) {
    source.storage.local.get('chTS', resp => {
        if (resp.chTS) {
            openNewTabWithFeedback(resp.chTS, chUId);
        }
        else {
            const chTS = new Date().getTime();

            source.storage.local.set({ chTS });
            openNewTabWithFeedback(chTS, chUId);
        }
    });
}
function prepareStorage() {
    source.storage.local.get(['chUId', 'defaultSettings'], resp => {
        if (!resp.chUId) {
            developmentMode
                ? source.storage.local.set({'chUId': 'tester'})
                : source.storage.local.set({'chUId': Date.now().toString(36) + Math.random().toString(36).substr(2)});

            return setTimeout(prepareStorage, 500);
        }
        if (!resp.defaultSettings) {
            setInstallTimestamp(resp.chUId);
        }
        setAnalytics(resp.chUId);
    });
}

const openDefiniteSettingPage = ({ target, hostname, origin }) => {
    switch (target) {
    case 'browser_settings': {
        source.tabs.create({'url': `chrome://settings/`}, () => {});
        break;
    }

    case 'privacy_settings': {
        source.tabs.create({'url': `chrome://settings/privacy`}, () => {});
        break;
    }

    case 'cookies_settings': {
        source.tabs.create({'url': `chrome://settings/cookies/detail?site=${hostname}`}, () => {});
        break;
    }

    case 'clear_data_settings': {
        source.tabs.create({'url': `chrome://settings/clearBrowserData`}, () => {});
        break;
    }

    case 'website_settings': {
        source.tabs.create({'url': `chrome://settings/content`}, () => {});
        break;
    }

    case 'domain_settings': {
        source.tabs.create({'url': `chrome://settings/content/siteDetails?site=${encodeURIComponent(origin)}`}, () => {});
        break;
    }
    }
};

source.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === 'OPEN_DEFINITE_SETTINGS') {
        openDefiniteSettingPage(request.data);
    }
    if (request.action === 'GET_DEFAULT_SETTINGS') {
        getDefaultSettings(sendResponse);
    }
    if (request.action === 'HIDE_UNTIL_TOMORROW') {
        source.storage.local.set({ lastHideData: new Date().getTime()});
    }
    if (request.action === 'NEVER_SHOW') {
        source.storage.local.get('neverShow', ({ neverShow }) => {
            const newNeverShow = neverShow ? [...neverShow] : [];

            newNeverShow.push(request.data.hostname);
            source.storage.local.set({ neverShow: newNeverShow });
        });
    }

    return true;
});

getDefaultSettings();
setTimeout(prepareStorage, 0);
setGSM();
