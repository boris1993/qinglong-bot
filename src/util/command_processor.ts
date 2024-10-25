import * as util from 'node:util';
import {
    addEnvironmentVariable,
    updateEnvironmentVariables,
    deleteEnvironmentVariable,
    enableEnvironmentVariable,
    disableEnvironmentVariable,
    getAllEnvironmentVariableKeys,
    getAllCronJobNames,
    triggerJob,
    getCronJobLog,
} from '../api/qinglong.js';
import {USAGE_HELP_TEXT, Command} from '../constants.js';
import {getErrorMessage} from './error_utils.js';
import {extractEnvKeyAndValue} from './utils.js';

async function processCommand(command: string, content: string): Promise<string> {
    let responseMessage: string;
    try {
        switch (command) {
            case Command.GET_ALL_ENV: {
                const allEnvKeys = await getAllEnvironmentVariableKeys();
                responseMessage = `环境变量列表:\n\n${allEnvKeys.join('\n\n')}`;
                break;
            }
            case Command.ADD_ENV: {
                responseMessage = await handleAddEnv(content);
                break;
            }
            case Command.UPDATE_ENV: {
                responseMessage = await handleUpdateEnv(content);
                break;
            }
            case Command.DELETE_ENV: {
                responseMessage = await handleDeleteEnv(content);
                break;
            }
            case Command.ENABLE_ENV: {
                responseMessage = await handleEnableEnv(content);
                break;
            }
            case Command.DISABLE_ENV: {
                responseMessage = await handleDisableEnv(content);
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

async function handleAddEnv(content: string): Promise<string> {
    let responseMessage: string = '';
    try {
        const [envAdded, invalidEnvPairs] = await addEnvironmentVariable(content);
        responseMessage += `成功添加环境变量${envAdded.join(',')}`;
        if (invalidEnvPairs.length > 0) {
            responseMessage += `，如下环境变量添加失败\n\n${invalidEnvPairs.join('\n\n')}`;
        }
    } catch (error) {
        responseMessage = `添加环境变量失败，错误信息：${getErrorMessage(error)}。可能因为要添加的环境变量已存在。`;
    }

    const allEnvKeys = await getAllEnvironmentVariableKeys();
    responseMessage += `\n\n当前环境变量列表:\n\n${allEnvKeys.join('\n\n')}`;

    return responseMessage;
}

async function handleUpdateEnv(content: string) {
    const [envKey, envValue] = extractEnvKeyAndValue(content);

    let responseMessage: string;
    try {
        await updateEnvironmentVariables(envKey, envValue);
        responseMessage = `成功更新环境变量${envKey}`;
    } catch (error) {
        const errorMessage = getErrorMessage(error);
        console.error(errorMessage);
        responseMessage = `环境变量更新失败，错误信息：${errorMessage}`;
    }

    const allEnvKeys = await getAllEnvironmentVariableKeys();
    responseMessage += `\n\n当前环境变量列表:\n\n${allEnvKeys.join('\n\n')}`;

    return responseMessage;
}

async function handleDeleteEnv(content: string) {
    let responseMessage: string;
    try {
        const envIds = [...new Set(content.split(',').map(id => id.trim()))].map(id => Number(id));
        await deleteEnvironmentVariable(envIds);
        responseMessage = `成功删除环境变量${envIds.join(',')}`;
    } catch (error) {
        responseMessage = `删除环境变量失败，错误信息：${getErrorMessage(error)}`;
    }

    const allEnvKeys = await getAllEnvironmentVariableKeys();
    responseMessage += `\n\n当前环境变量列表:\n\n${allEnvKeys.join('\n\n')}`;

    return responseMessage;
}

async function handleEnableEnv(content: string) {
    let responseMessage: string;
    try {
        const envIds = [...new Set(content.split(',').map(id => id.trim()))].map(id => Number(id));
        await enableEnvironmentVariable(envIds);
        responseMessage = `成功启用环境变量${envIds.join(',')}`;
    } catch (error) {
        responseMessage = `启用环境变量失败，错误信息：${getErrorMessage(error)}`;
    }

    const allEnvKeys = await getAllEnvironmentVariableKeys();
    responseMessage += `\n\n当前环境变量列表:\n\n${allEnvKeys.join('\n\n')}`;

    return responseMessage;
}

async function handleDisableEnv(content: string) {
    let responseMessage: string;
    try {
        const envIds = [...new Set(content.split(',').map(id => id.trim()))].map(id => Number(id));
        await disableEnvironmentVariable(envIds);
        responseMessage = `成功禁用环境变量${envIds.join(',')}`;
    } catch (error) {
        responseMessage = `禁用环境变量失败，错误信息：${getErrorMessage(error)}`;
    }

    const allEnvKeys = await getAllEnvironmentVariableKeys();
    responseMessage += `\n\n当前环境变量列表:\n\n${allEnvKeys.join('\n\n')}`;

    return responseMessage;
}

export {
    processCommand,
};
