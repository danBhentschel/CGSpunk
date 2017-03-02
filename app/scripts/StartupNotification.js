(function () {
    'use strict';

    // 0.2.16 = 00216xx
    var currentVersion = 21601;

    var isFirefox = typeof InstallTrigger !== 'undefined';

    chrome.storage.sync.get({ 'newFeatures': 0 }, items => {
        if (items.newFeatures < currentVersion) {
            chrome.notifications.create('new-features', getNotificationOptions(), onNotificationCreated);
            chrome.storage.sync.set({ 'newFeatures': currentVersion });
        }
    });

    function getNotificationOptions() {
        let notificationOptions = {
            type: 'basic',
            iconUrl: 'images/CGSpunk_128.png',
            title: 'New in CG Spunk 0.2.16',
            message: 'At the request of CodinGame staff, CG Spunk now inserts a delay between matches of a batch run.'
        };

        if (!isFirefox) {
            notificationOptions.buttons = [ { title: 'More information' } ];
            notificationOptions.requireInteraction = true;
        }

        return notificationOptions;
    }

    function onNotificationCreated(notificationId) {
        if (isFirefox) {
            return;
        }

        chrome.notifications.onButtonClicked.addListener((buttonNotificationId, buttonIndex) => {
            if (buttonNotificationId === notificationId && buttonIndex == 0) {
                chrome.tabs.create({ url: 'https://github.com/danBhentschel/CGSpunk/issues/62' });
            }
        });
    }

})();
