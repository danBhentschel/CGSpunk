(function () {
    'use strict';

    // 0.2.16 = 00216xx
    var currentVersion = 22000;

    var isFirefox = typeof InstallTrigger !== 'undefined';

    chrome.storage.sync.get({ 'newFeatures': 0 }, items => {
        if (items.newFeatures < 21600) {
            chrome.notifications.create('new-features-21600', getNotificationOptions_216(), onNotificationCreated_216);
        }

        if (items.newFeatures < 21801) {
            chrome.notifications.create('new-features-21800', getNotificationOptions_218());
        }

        if (items.newFeatures < 22000) {
            chrome.notifications.create('new-features-22000', getNotificationOptions_220(), onNotificationCreated_220);
        }

        if (items.newFeatures < currentVersion) {
            chrome.storage.sync.set({ 'newFeatures': currentVersion });
        }
    });

    function getNotificationOptions_220() {
        let notificationOptions = {
            type: 'basic',
            iconUrl: 'images/CGSpunk_128.png',
            title: 'New in CG Spunk 0.2.20',
            message: 'CG Spunk can now report scores and "Station Bounce" errors for Code4Life. You should refresh your CG tab before using.'
        };

        if (!isFirefox) {
            notificationOptions.buttons = [ { title: 'More information' } ];
            notificationOptions.requireInteraction = true;
        }

        return notificationOptions;
    }

    function onNotificationCreated_220(notificationId) {
        if (isFirefox) {
            return;
        }

        chrome.notifications.onButtonClicked.addListener((buttonNotificationId, buttonIndex) => {
            if (buttonNotificationId === notificationId && buttonIndex == 0) {
                chrome.tabs.create({ url: 'https://github.com/danBhentschel/CGSpunk/issues/71' });
            }
        });
    }

    function getNotificationOptions_218() {
        let notificationOptions = {
            type: 'basic',
            iconUrl: 'images/CGSpunk_128.png',
            title: 'New in CG Spunk 0.2.18',
            message: 'CG Spunk will now show the Log dialog whenever running an MP game from the IDE. This can be disabled in the extension options.'
        };

        if (!isFirefox) {
            notificationOptions.requireInteraction = true;
        }

        return notificationOptions;
    }

    function getNotificationOptions_216() {
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

    function onNotificationCreated_216(notificationId) {
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
