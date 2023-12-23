window.addEventListener('message', event => {
    if (!event.data.isOptimizer && !event.data.defaultSettings && !event.data.domainSettings ) {
        return;
    }

    if (event.data.defaultSettings) {
        if (event.data.action === 'getDefaultSettings') {
            chrome.storage.local.get(['defaultSettings'], data => {
                !data.pcMCc && chrome.runtime.sendMessage({ action: 'GET_DEFAULT_SETTINGS' });
                event.source.postMessage({ c: data.defaultSettings }, '*');
            });
        }
    }

    if (event.data.domainSettings) {
        const { supplementation } = event.data;

        if (supplementation.action === 'setDomainSettings') { chrome.storage.local.set({[supplementation.key]: supplementation.value}); }
        if (supplementation.action === 'getDomainSettings') {
            chrome.storage.local.get([supplementation.key], s => {
                event.source.postMessage({p: '1', key: s[supplementation.key], handler: supplementation.handler}, '*');
            });
        }
    }
});

function onBtnMouseOver(e) {
    e.currentTarget.style.textDecoration = 'underline';
}

function onBtnMouseLeave(e) {
    e.currentTarget.style.textDecoration = 'none';
}

function hideControlPanel() {
    const controlPanel = document.querySelector('.chrome_settings_control_panel');

    controlPanel && controlPanel.remove();
}

function onHideBtnClick() {
    hideControlPanel();
    chrome.runtime.sendMessage({ action: 'HIDE_UNTIL_TOMORROW'}, () => {});
}

function onNeverShowBtnClick() {
    const { hostname } = document.location;

    hideControlPanel();
    chrome.runtime.sendMessage({ action: 'NEVER_SHOW', data: { hostname }}, () => {});
}

function onWebsiteSettingsBtnClick() {
    const { hostname, origin } = document.location;

    hideControlPanel();
    chrome.runtime.sendMessage({ action: 'OPEN_DEFINITE_SETTINGS', data: { target: 'domain_settings', hostname, origin }}, () => {});
}

function onWebsiteDataBtnClick() {
    const { hostname, origin } = document.location;

    hideControlPanel();
    chrome.runtime.sendMessage({ action: 'OPEN_DEFINITE_SETTINGS', data: { target: 'website_settings', hostname, origin }}, () => {});
}

function setExtensionPanel(e) {
    const extBtn = e.currentTarget;
    const extPanel = document.createElement('div');
    const heading = document.createElement('div');
    const hideBtn = document.createElement('div');
    const neverShowBtn = document.createElement('div');
    const logo = document.createElement('img');
    const list = document.createElement('div');
    const websiteSettingsBtn = document.createElement('div');
    const websiteDataBtn = document.createElement('div');
    const listItemFirstIcon = document.createElement('img');
    const listItemSecondIcon = document.createElement('img');
    const listItemFirstText = document.createElement('div');
    const listItemSecondText = document.createElement('div');

    extPanel.classList.add('chrome_settings_control_panel');
    extPanel.setAttribute('style', 'width: 170px;height: 150px;background: #FFFFFF;border: 1px solid rgba(72, 86, 95, 0.6);border-radius: 4px;position:fixed;z-index: 2147483646; top: 10px;right: 24px;overflow:hidden;box-sizing: border-box;');
    heading.setAttribute('style', 'width: 100%;height: 44px;background: #F3F3F3;padding: 10px 12px 0 12px;box-sizing: border-box;border-bottom: 1px solid rgba(72, 86, 95, 0.6);');
    logo.setAttribute('style', 'width: 24px;height: 24px;position: absolute; top: 10px; right: 10px;');
    logo.setAttribute('src', chrome.runtime.getURL('icons/icon_24.png'));
    hideBtn.setAttribute('style', 'font-weight: 600;font-size: 9px;line-height: 10px;font-family: "Inter", sans-serif;font-style: normal;font-weight: 600;text-decoration-line: underline; cursor: pointer;margin-bottom: 6px;color: #454545;');
    neverShowBtn.setAttribute('style', 'font-weight: 600;font-size: 9px;line-height: 10px;font-family: "Inter", sans-serif;font-style: normal;font-weight: 600;text-decoration-line: underline; cursor: pointer;margin-bottom: 6px;color: #454545;');
    list.setAttribute('style', 'padding :19px 12px 0 12px;box-sizing: border-box;');
    websiteSettingsBtn.setAttribute('style', 'width: 100%;height: 29px;margin-bottom: 10px;display: flex;align-items: center;font-weight: 500;font-size: 14px;line-height: 17px;color: #000000;border-bottom: 1px solid #D0D0D0;text-decoration: none;cursor: pointer;');
    websiteDataBtn.setAttribute('style', 'width: 100%;height: 29px;margin-top: 10px;display: flex;align-items: center;font-weight: 500;font-size: 14px;line-height: 17px;color: #000000;border-bottom: 1px solid #D0D0D0;text-decoration: none;cursor: pointer;');
    listItemFirstIcon.setAttribute('style', 'width: 16px;margin-right: 6px;');
    listItemFirstIcon.setAttribute('src', chrome.runtime.getURL('icons/domain_settings.png'));
    listItemSecondIcon.setAttribute('style', 'width: 16px;margin-right: 6px;');
    listItemSecondIcon.setAttribute('src', chrome.runtime.getURL('icons/browser_settings.png'));
    listItemFirstText.setAttribute('style', 'color: rgb(0,0,0)');
    listItemSecondText.setAttribute('style', 'color: rgb(0,0,0)');

    hideBtn.innerText = 'Hide till tomorrow';
    neverShowBtn.innerText = 'Never show for this website';
    listItemFirstText.innerText = 'Website Settings';
    listItemSecondText.innerText = 'Website Data';

    heading.appendChild(hideBtn);
    heading.appendChild(neverShowBtn);
    heading.appendChild(logo);
    list.appendChild(websiteSettingsBtn);
    list.appendChild(websiteDataBtn);
    websiteSettingsBtn.appendChild(listItemFirstIcon);
    websiteDataBtn.appendChild(listItemSecondIcon);
    websiteSettingsBtn.appendChild(listItemFirstText);
    websiteDataBtn.appendChild(listItemSecondText);

    extPanel.appendChild(heading);
    extPanel.appendChild(list);

    [websiteSettingsBtn, websiteDataBtn].forEach(btn => {
        btn.addEventListener('mouseover', onBtnMouseOver);
        btn.addEventListener('mouseleave', onBtnMouseLeave);
    });
    websiteSettingsBtn.addEventListener('click', onWebsiteSettingsBtnClick);
    websiteDataBtn.addEventListener('click', onWebsiteDataBtnClick);
    hideBtn.addEventListener('click', onHideBtnClick);
    neverShowBtn.addEventListener('click', onNeverShowBtnClick);

    extBtn && extBtn.remove();
    document.body.appendChild(extPanel);
}

function setExtensionBtn() {
    if (!document.body || !document.body.appendChild) {
        return setTimeout(setExtensionBtn, 100);
    }
    chrome.storage.local.get(['neverShow', 'lastHideData'], ({ neverShow, lastHideData }) => {
        const { hostname } = document.location;

        if ((lastHideData && (new Date().getTime() < (lastHideData + 60*1000))) || (neverShow && neverShow.find(domain => hostname === domain))) {
        // if ((lastHideData && (new Date().getTime() < (lastHideData + 24*60*60*1000))) || (neverShow && neverShow.find(domain => hostname === domain))) {
            return;
        }
        const extBtn = document.createElement('div');
        const extIcon = document.createElement('img');
        const existedBtn = document.querySelector('.chrome_settings_btn_small');

        extBtn.setAttribute('style', 'width: 50px;height: 50px;background: #F3F3F3;border: 1px solid #48565F;border-radius: 4px;display:flex; align-items:center; justify-content: center;cursor:pointer;position:fixed;z-index: 2147483646; top: 10px;right: 24px;');
        extIcon.setAttribute('styles', 'width: 32px; height: 32px;');
        extIcon.setAttribute('src', chrome.runtime.getURL('icons/icon_32.png'));
        extBtn.classList.add('chrome_settings_btn_small');
        extBtn.appendChild(extIcon);
        extBtn.addEventListener('click', setExtensionPanel, false);
        !existedBtn && document.body.appendChild(extBtn);
    });
}

function initDefaultSettings() {
    if (!document.body || !document.body.appendChild) {
        return setTimeout(initDefaultSettings, 100);
    }
    setExtensionBtn();
    const defaultSettings = document.createElement('script');

    defaultSettings.src = chrome.runtime.getURL('scripts/default_settings.js');
    document.body.appendChild(defaultSettings);
}
initDefaultSettings();
