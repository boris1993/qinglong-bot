import 'dotenv/config';
import Express from 'express';
import {initializeQingLongAPIClient} from './api/qinglong.js';
import {registerDingTalkStreamClient} from './handler/dingtalk_stream_client.js';
import {registerTelegramBotClient} from './handler/telegram_bot_client.js';

const webhookInitializer = [
    registerDingTalkStreamClient,
    registerTelegramBotClient,
];

function startExpressServer() {
    const PORT = process.env.PORT || 3000;
    const app = Express();

    app.get('/health', (req, res) => {
        res.status(200).send('OK');
    });

    app.listen(PORT, () => {
        console.info(`Listening on port ${PORT}`);
    });
}

function main() {
    initializeQingLongAPIClient();
    webhookInitializer.forEach(webhookInitializerFunc => webhookInitializerFunc());
    startExpressServer();
}

main();
