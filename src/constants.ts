enum Command {
    GET_ALL_ENV = '获取所有环境变量',
    UPDATE_ENV = '更新环境变量',
    ADD_ENV = '添加环境变量',
    GET_ALL_CRON_JOBS = '获取所有任务',
    TRIGGER_JOB = '运行任务',
    GET_LOG = '获取任务日志',
}

const QingLongAPI = {
    LOGIN: '/open/auth/token?client_id=%s&client_secret=%s',
    ENV: '/open/envs',
    CRON_JOB: '/open/crons',
    TRIGGER_JOB: '/open/crons/run',
    GET_LOG: '/open/crons/%s/log',
};

const USAGE_HELP_TEXT = `
当前支持的命令有：%s

用法：
- 获取所有环境变量：直接向机器人发送 **获取所有环境变量** 命令即可
- 更新环境变量： **更新环境变量#环境变量名称=环境变量值** （如 **更新环境变量#meituanCookie=abc123** ）
- 获取所有任务：直接向机器人发送 **获取所有任务** 命令即可
- 运行任务：**运行任务#定时任务名称**
- 获取任务日志: **获取任务日志#定时任务名称**
`;

export {
    Command,
    QingLongAPI,
    USAGE_HELP_TEXT
};
