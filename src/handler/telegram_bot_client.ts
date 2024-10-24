import util from 'node:util';
import {HttpsProxyAgent} from 'https-proxy-agent';
import {Context, Telegraf} from 'telegraf';
import {message} from 'telegraf/filters';
import {marked} from 'marked';
import {Command, USAGE_HELP_TEXT} from '../constants.js';
import {processCommand} from '../util/command_processor.js';
import {getErrorMessage} from '../util/error_utils.js';

function registerTelegramBotClient() {
    const botToken = process.env.TG_BOT_TOKEN as string;
    if (!botToken) {
        console.warn('Telegram bot token未指定，跳过注册Telegram机器人');
        return;
    }

    let agent: HttpsProxyAgent<string> | undefined = undefined;
    const proxyUrl = process.env.TG_PROXY || '';
    if (proxyUrl) {
        agent = new HttpsProxyAgent(proxyUrl);
    }

    const tgApiRoot = process.env.TG_API_ROOT as string;
    let bot;
    if (agent) {
        bot = new Telegraf(botToken, {
            telegram: {
                agent: agent,
                apiRoot: tgApiRoot,
            },
        });
    } else {
        bot = new Telegraf(botToken, {
            telegram: {
                apiRoot: tgApiRoot,
            },
        });
    }

    bot.start(ctx => handleStartCommand(ctx));
    bot.command('help', handleHelpCommand);
    bot.on(message('text'), handleCommand);
    bot.catch(error => console.error(getErrorMessage(error)));

    process.once('SIGINT', () => bot.stop('SIGINT'));
    process.once('SIGTERM', () => bot.stop('SIGTERM'));

    bot.launch().catch(error => {
        // 注册成功不代表能连上，连不上的话telegraf会抛出一个error并导致本应用崩溃
        // 所以需要在这里处理这个error
        console.error(`Telegram机器人无法连接到Telegram服务器，初始化失败。错误信息：${getErrorMessage(error)}`);
    });
    console.info('Telegram机器人注册成功');
}

async function handleStartCommand(context: Context): Promise<void> {
    await sendReply(context, `欢迎使用青龙机器人\n\n${formatHelpMessage()}`);
}

async function handleHelpCommand(context: Context): Promise<void> {
    await sendReply(context, formatHelpMessage());
}

async function handleCommand(context: Context): Promise<void> {
    const messageText = context.text || '';
    const [command, content] = messageText.trim().split('#');
    const responseMessage = await processCommand(command, content);
    await sendReply(context, responseMessage);
}

function formatHelpMessage(): string {
    return util.format(
        USAGE_HELP_TEXT,
        Object.values(Command).map(key => `\`${key}\``).join('，')
    );
}

async function sendReply(context: Context, message: string) {
    // Telegram的Markdown格式神烦，得escape一堆东西，那还不如转成HTML发
    const replyHtml = await marked.parseInline(message.trim());
    const stringParts = replyHtml.split('\n').filter(parts => parts);

    // Telegram限制一条信息长度不能超过4KB，所以需要把长消息截断分批发送
    let replyString = '';
    for (const part of stringParts) {
        // 拼接满4KB就发，然后清空缓冲区并继续拼接
        if (replyString.length + part.length >= 4096) {
            await context.replyWithHTML(replyString);
            replyString = '';
        }

        // 否则就继续拼接
        replyString += `${part.trim()}\n`;
    }

    // 前面几段都发完之后，缓冲区大概率还有最后一段没发，那么现在发出去
    if (replyString) {
        await context.replyWithHTML(replyString);
    }
}

export {
    registerTelegramBotClient,
};
