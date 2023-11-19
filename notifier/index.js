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
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(teamsCard),
            headers: { 'Content-Type': 'application/json' }
        });
        console.info("Notified teams at %s. Status code: %s", url, response.status);
        console.info(response);

        return true;
    } catch (error) {
        console.error("Failed to notify teams at %s", url);
        console.error(error);

        return false;
    }
}

function createTeamsCard(menus) {
    let card = {
        "type": "message",
        "attachments": [
            {
                "contentType": "application/vnd.microsoft.teams.card.o365connector",
                "content": {
                    "@type": "MessageCard",
                    "@context": "http://schema.org/extensions",
                    "summary": "Today's lunch options in Dockan, Malmö-",
                    "title": "Today's lunch",
                    "sections": menus.map(menu => ({
                        title: menu.name,
                        facts: {
                            "title": "Details",
                            "text": "`" + JSON.stringify(menu.results) + "`"
                        }
                    }))
                }
            }]
    };

    return card;
}

exports.run = async (req, res) => {
    if (! myConfig.teamsWebhookUrl) {
        console.info("No notification reciever setup. Exiting.");
        res.status(200).text("No one to notify.");
        
        return;
    }

    const menus = await read(myConfig.bucketName, myConfig.fileName);
    if (menus.length == 0) {
        console.info("No menus available. Exiting.");
        res.status(200).text("Nothing to notify.");
        
        return;
    }

    let notificationResult = await notifyTeams(myConfig.teamsWebhookUrl, menus);
    console.info("Teams notified with success: %s", notificationResult);

    res.status(200).text("Notications sent.");
}
