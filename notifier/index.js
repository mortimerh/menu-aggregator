const { Storage } = require('@google-cloud/storage');
const fetch = require('node-fetch');
const myConfig = require('./config');

async function read(bucketName, fileName) {
    try {
        // Creates a client
        const storage = new Storage();

        const fileContents = await storage.bucket(bucketName).file(fileName).download();
        const data = JSON.parse(fileContents);
        console.info("Fetched menus data from %s/%s", bucketName, fileName);

        return data;
    } catch (error) {
        console.error("Failed to fetch menus data from %s/%s", bucketName, fileName);
        console.error(error);
    }

    return null; // @fixme should return null on failure, or maybe raise the exception to run()
}

async function notifyTeams(url, menus) {
    try {
        const teamsCard = createTeamsCard(menus);
        console.debug("Created teams card:");
        console.debug(teamsCard);
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(teamsCard),
            headers: { 'Content-Type': 'application/json' }
        });
        console.info("Notified teams at %s. Status code: %s", url, response.status);
        console.debug(await response.json());

        return true;
    } catch (error) {
        console.error("Failed to notify teams at %s", url);
        console.error(error);

        return false;
    }
}

function createTeamsCard(restaurantMenus) {
    let card = {
        "type": "message",
        "attachments": [
            {
                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                "version": "1.5",
                "contentType": "application/vnd.microsoft.card.adaptive",
                "contentUrl": null,
                "content": {
                    "type": "AdaptiveCard",
                    "body": [
                        {
                            "type": "TextBlock",
                            "size": "Medium",
                            "weight": "Bolder",
                            "text": "Dagens lunch " + (new Date()).toLocaleDateString("sv-SE")
                        },
                        ...restaurantMenus.map(restaurant => ({
                            "type": "Container",
                            "items": [
                                {
                                    "type": "TextBlock",
                                    "weight": "Bolder",
                                    "text": restaurant.name,
                                    "wrap": true
                                },
                                {
                                    "type": "TextBlock",
                                    "spacing": "None",
                                    "text": "Uppdaterades " + restaurant.lastChanged,
                                    "isSubtle": true,
                                    "wrap": true
                                },
                                {
                                    "type": "FactSet",
                                    "facts": restaurant.menu.map(menuItem => ({
                                        "title": menuItem.label,
                                        "value": menuItem.dish
                                    }))
                                }
                            ]
                        }))
                    ],
                    "actions": [
                        {
                            "type": "Action.OpenUrl",
                            "title": "View on web",
                            "url": myConfig.websiteUrl
                        }
                    ]
                }
            }
        ]
    };

    return card;
}

exports.run = async (req, res) => {
    if (!myConfig.teamsWebhookUrl) {
        console.info("No notification reciever setup. Exiting.");
        res.status(200).send("No one to notify.");

        return;
    }

    const menus = await read(myConfig.bucketName, myConfig.fileName);
    if (menus.length == 0) {
        console.info("No menus available. Exiting.");
        res.status(200).send("Nothing to notify.");

        return;
    }

    let notificationResult = await notifyTeams(myConfig.teamsWebhookUrl, menus);
    console.info("Teams notified with success: %s", notificationResult);

    res.status(200).send("Notications sent.");
}
