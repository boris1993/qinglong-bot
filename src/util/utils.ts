function extractEnvKeyAndValue(content: string): [string, string] {
    const equalSignIndex = content.indexOf('=');
    const envKey = content.substring(0, equalSignIndex);
    const envValue = content.substring(equalSignIndex + 1, content.length);

    return [envKey, envValue];
}

export {
    extractEnvKeyAndValue
}
