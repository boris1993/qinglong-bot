enum Command {
    GET_ALL_ENV = '获取所有环境变量',
    UPDATE_ENV = '更新环境变量',
    GET_ALL_CRON_JOBS = '获取所有任务',
}

const QingLongAPI = {
    LOGIN: '/open/auth/token?client_id=%s&client_secret=%s',
    ENV: '/open/envs',
    CRON_JOB: '/open/crons',
}

const USAGE_HELP_TEXT = `
当前支持的命令有：%s

用法：
- 获取所有环境变量：直接向机器人发送 **获取所有环境变量** 命令即可
- 更新环境变量： **更新环境变量#环境变量名称=环境变量值** （如 **更新环境变量#meituanCookie=abc123** ）
`;

export {
    Command,
    QingLongAPI,
    USAGE_HELP_TEXT
}