class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

class QingLongInitializationError extends Error {
    constructor() {
        super('青龙相关环境变量不完整，初始化失败');
    }
}

class QingLongEnvNotFoundError extends Error {
    constructor(name: string) {
        super(`青龙环境变量${name}不存在`);
    }
}

class QingLongJobNotFoundError extends Error {
    constructor(name: string) {
        super(`青龙定时任务${name}不存在`);
    }
}

class QingLongAPIError extends Error {
    constructor(message: string) {
        super(`请求失败，错误信息：${message}`);
    }
}

export {
    BadRequestError,
    QingLongInitializationError,
    QingLongEnvNotFoundError,
    QingLongAPIError,
    QingLongJobNotFoundError,
}
