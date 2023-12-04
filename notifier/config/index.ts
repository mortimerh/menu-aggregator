interface NotifierConfig {
    bucketName: string;
    fileName: string;
    teamsWebhookUrl: string;
    websiteUrl: string;
};

export const config: NotifierConfig = {
    bucketName: process.env.BUCKET_NAME || "",
    fileName: "data/menus.json",
    teamsWebhookUrl: process.env.SECRET_CONFIG || "",
    websiteUrl: ""
};

