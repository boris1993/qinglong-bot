interface DingTalkMessage {
    msgtype: string,
    text?: {
        content: string,
    },
    markdown?: {
        title: string,
        text: string
    },
    at: {
        atUserIds: string
    }
}

export {
    DingTalkMessage,
}
