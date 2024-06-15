import {DWClient, DWClientDownStream, RobotMessage, TOPIC_ROBOT} from 'dingtalk-stream';
import {DingTalkMessage} from '../model/dingtalk.js';
import {updateEnvironmentVariables} from '../api/qinglong.js';
import axios from "axios";

let client: DWClient;

function registerDingTalkStreamClient() {
    const clientId = process.env.DINGTALK_CLIENT_ID;
    const clientSecret = process.env.DINGTALK_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
        console.warn('钉钉机器人配置不完整，跳过注册钉钉机器人');
        return;
    }

    client = new DWClient({
        clientId: clientId,
        clientSecret: clientSecret
    });

    client.registerCallbackListener(TOPIC_ROBOT, onBotMessage)
        .connect()
        .then(() => console.info('钉钉机器人注册成功'));
}

const onBotMessage = async (event: DWClientDownStream) => {
    const message = JSON.parse(event.data) as RobotMessage;
    const content = (message?.text?.content || '').trim();
    const [envKey, envValue] = content.split('=');

    let responseMessage: string;
    try {
        await updateEnvironmentVariables(envKey, envValue);
        responseMessage = `成功更新环境变量${envKey}`;
    } catch (error: any) {
        console.error(error.message);
        responseMessage = `环境变量更新失败，错误信息：${error.message}`;
    }

    const accessToken = await client.getAccessToken();
    const messageBody: DingTalkMessage = {
        msgtype: 'text',
        text: {
            content: responseMessage
        },
        at: {
            atUserIds: message?.senderStaffId || ''
        }
    };

    const replyMessageResponse = await axios.post(
        message.sessionWebhook,
        messageBody,
        {
            responseType: 'json',
            headers: {
                "x-acs-dingtalk-access-token": accessToken,
            }
        },
    );

    // 需要返回消息响应，否则服务端会在60秒后重发
    client.socketCallBackResponse(event.headers.messageId, replyMessageResponse.data);
}

export {
    registerDingTalkStreamClient,
}
