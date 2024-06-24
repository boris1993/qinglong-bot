import * as util from 'node:util';
import {
    updateEnvironmentVariables,
    getAllEnvironmentVariableKeys,
    getAllCronJobNames,
    triggerJob,
    getCronJobLog,
} from '../api/qinglong.js';
import {USAGE_HELP_TEXT, Command} from '../constants.js';
import {getErrorMessage} from './error_utils.js';

async function processCommand(command: string, content: string): Promise<string> {
    let responseMessage: string;
    try {
        switch (command) {
            case Command.GET_ALL_ENV: {
                const allEnvKeys = await getAllEnvironmentVariableKeys();
                responseMessage = `环境变量列表:\n\n${allEnvKeys.join('\n\n')}`;
                break;
            }
            case Command.UPDATE_ENV: {
                responseMessage = await handleUpdateEnv(content);
                break;
            }
            case Command.GET_ALL_CRON_JOBS: {
                const allCronJobs = await getAllCronJobNames();
                responseMessage = `定时任务列表：\n\n${allCronJobs.join('\n\n')}`;
                break;
            }
            case Command.TRIGGER_JOB: {
                await triggerJob(content);
                responseMessage = `已执行定时任务${content}`;
                break;
            }
            case Command.GET_LOG: {
                responseMessage = await getCronJobLog(content);
                break;
            }
            default: {
                responseMessage = util.format(
                    USAGE_HELP_TEXT,
                    Object.values(Command).map(key => `\`${key}\``).join('，')
                ).trim();
                break;
            }
        }
    } catch (error) {
        responseMessage = getErrorMessage(error);
        if (responseMessage.includes('jwt malformed')) {
            responseMessage = `${responseMessage}，请检查青龙中是否赋予了对应的权限`;
        }
    }

    return responseMessage;
}

async function handleUpdateEnv(content: string) {
    const [envKey, envValue] = content.split('=');

    let responseMessage: string;
    try {
        await updateEnvironmentVariables(envKey, envValue);
        responseMessage = `成功更新环境变量${envKey}`;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        responseMessage = `环境变量更新失败，错误信息：${errorMessage}`;
    }

    return responseMessage;
}

export {
    processCommand,
}
