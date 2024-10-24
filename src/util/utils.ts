function extractEnvKeyAndValue(content: string): [string | number, string] {
    const equalSignIndex = content.indexOf('=');
    const envKey = isNaN(Number(content.substring(0, equalSignIndex)))
        ? content.substring(0, equalSignIndex)
        : Number(content.substring(0, equalSignIndex));
    const envValue = content.substring(equalSignIndex + 1, content.length);

    return [envKey, envValue];
}

export {
    extractEnvKeyAndValue
}
