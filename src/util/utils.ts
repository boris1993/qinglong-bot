import { SimpleCommand } from '../constants.js'

function extractCommandAndContent(messageText: string): [string, string] {
    const simpleCommandPrefixes = Object.values(SimpleCommand);
    const isSimpleCommand = simpleCommandPrefixes.some(prefix => messageText.startsWith(prefix));
    let command,content;
    if (isSimpleCommand) {
        const parts = messageText.trim().split(' ');
        command = parts[0] + ' ' + parts[1];
        content = parts[2] !== undefined ? parts[2] : '';
    } else {
        [command, content] = messageText.trim().split('#');
    }
    return [command, content];
}

function extractEnvKeyAndValue(content: string): [string | number, string] {
    const equalSignIndex = content.indexOf('=');
    const envKey = isNaN(Number(content.substring(0, equalSignIndex)))
        ? content.substring(0, equalSignIndex)
        : Number(content.substring(0, equalSignIndex));
    const envValue = content.substring(equalSignIndex + 1, content.length);

    return [envKey, envValue];
}

export {
    extractEnvKeyAndValue,
    extractCommandAndContent
}
