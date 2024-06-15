interface DingTalkMessage {
    msgtype: string,
    text: {
        content: string,
    },
    at: {
        atUserIds: string
    }
}

export {
    DingTalkMessage,
}
