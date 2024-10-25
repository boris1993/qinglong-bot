enum Command {
    GET_ALL_ENV = '获取所有环境变量',
    UPDATE_ENV = '更新环境变量',
    ADD_ENV = '添加环境变量',
    DELETE_ENV = '删除环境变量',
    ENABLE_ENV = '启用环境变量',
    DISABLE_ENV = '禁用环境变量',
    GET_ALL_CRON_JOBS = '获取所有任务',
    TRIGGER_JOB = '运行任务',
    GET_LOG = '获取任务日志',
}

const QingLongAPI = {
    LOGIN: '/open/auth/token?client_id=%s&client_secret=%s',
    ENV: '/open/envs',
    ENV_ENABLE: '/open/envs/enable',
    ENV_DISABLE: '/open/envs/disable',
    CRON_JOB: '/open/crons',
    TRIGGER_JOB: '/open/crons/run',
    GET_LOG: '/open/crons/%s/log',
};

const USAGE_HELP_TEXT = `
当前支持的命令有：%s

用法：
- 获取所有环境变量：直接向机器人发送 **获取所有环境变量** 命令即可
- 添加环境变量： **添加环境变量#环境变量名称=环境变量值**，多个环境变量用英文逗号分割（如 **添加环境变量#env1=123,env2=456** ）
- 更新环境变量： **更新环境变量#环境变量名称=环境变量值** （如 **更新环境变量#meituanCookie=abc123** ）
- 删除环境变量： **删除环境变量#环境变量ID**，多个环境变量ID用英文逗号分割（如 **删除环境变量#1,2,3** ）
- 启用环境变量： **启用环境变量#环境变量ID**，多个环境变量ID用英文逗号分割（如 **启用环境变量#1,2,3** ）
- 禁用环境变量： **禁用环境变量#环境变量ID**，多个环境变量ID用英文逗号分割（如 **禁用环境变量#1,2,3** ）
- 获取所有任务：直接向机器人发送 **获取所有任务** 命令即可
- 运行任务：**运行任务#定时任务名称**
- 获取任务日志: **获取任务日志#定时任务名称**
`;

export {
    Command,
    QingLongAPI,
    USAGE_HELP_TEXT
};
