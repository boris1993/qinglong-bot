import * as util from 'node:util';
import axios from 'axios';
import {QingLongAPI} from '../constants.js';
import {
    TriggerJobRequest,
    AddEnvRequest,
    UpdateEnvRequest,
    Response,
    LoginResult,
    GetAllEnvResponse,
    GetAllCronJobResponse,
    QingLongRequest,
} from '../model/qinglong.js';
import {
    BadRequestError,
    QingLongAPIError,
    QingLongEnvNotFoundError,
    QingLongInitializationError,
    QingLongJobNotFoundError,
} from '../error/error.js';
import {extractEnvKeyAndValue} from '../util/utils.js';

axios.defaults.validateStatus = (status) => {
    return status < 500;
};

let baseUrl = '';
let clientId = '';
let clientSecret = '';

let token = '';
let expiration = 0;

function initializeQingLongAPIClient() {
    baseUrl = process.env.QINGLONG_URL || '';
    clientId = process.env.QINGLONG_CLIENT_ID || '';
    clientSecret = process.env.QINGLONG_CLIENT_SECRET || '';

    if (!baseUrl || !clientId || !clientSecret) {
        throw new QingLongInitializationError();
    }

    void login();
    setInterval(async () => {
        const currentTimestamp = Date.now();
        if (currentTimestamp - 5000 >= expiration) {
            await login();
        }
    }, 60000);
}

async function login() {
    const response = await axios.get(`${baseUrl}${util.format(QingLongAPI.LOGIN, clientId, clientSecret)}`);
    const loginResponse = response.data as Response;
    ensureSuccessfulResponse(loginResponse);

    const loginResult: LoginResult = loginResponse.data as LoginResult;
    token = loginResult.token;
    expiration = loginResult.expiration * 1000;

    console.info(`成功刷新青龙Token，有效期至${new Date(expiration).toLocaleString()}`);
}

async function getAllEnvironmentVariables(): Promise<GetAllEnvResponse[]> {
    return await doGetRequest<GetAllEnvResponse[]>(QingLongAPI.ENV);
}

async function getAllEnvironmentVariableKeys(): Promise<string[]> {
    const allEnvironmentVariables = await getAllEnvironmentVariables();
    return allEnvironmentVariables.map(env => {
        let envNameAndComment = env.name;
        if (env.remarks) {
            envNameAndComment += `（${env.remarks}）`;
        }

        return env.id + '：' + envNameAndComment;
    });
}

async function getAllCronJobs(): Promise<GetAllCronJobResponse> {
    return await doGetRequest<GetAllCronJobResponse>(QingLongAPI.CRON_JOB);
}

async function getAllCronJobNames(): Promise<string[]> {
    const allCronJobs = await getAllCronJobs();
    return allCronJobs.data.map(cron => cron.name);
}

async function triggerJob(jobName: string): Promise<void> {
    const allJobs = await getAllCronJobs();
    const jobToBeTriggered = allJobs.data.filter(job => job.name === jobName)[0];
    if (!jobToBeTriggered) {
        throw new QingLongJobNotFoundError(jobName);
    }

    const jobId = jobToBeTriggered.id;
    const triggerJobRequest: TriggerJobRequest = [jobId];
    await doPutRequest(QingLongAPI.TRIGGER_JOB, triggerJobRequest);
}

async function addEnvironmentVariable(content: string): Promise<string[][]> {
    const envPairs = content.split(',').map(envPair => envPair.trim());

    const envsToBeAdded: AddEnvRequest[] = [];
    const invalidPairs: string[] = [];
    for (const envPair of envPairs) {
        const [envKey, envValue] = extractEnvKeyAndValue(envPair);
        if (!envKey || !envValue) {
            invalidPairs.push(envPair);
            continue;
        }

        const addEnvRequest: AddEnvRequest = {
            name: envKey as string,
            value: envValue,
            remarks: ''
        };
        envsToBeAdded.push(addEnvRequest);
    }

    await doPostRequest<AddEnvRequest[]>(QingLongAPI.ENV, envsToBeAdded);
    const addedEnvs = envsToBeAdded.map(envsToBeAdded => envsToBeAdded.name);

    return [addedEnvs, invalidPairs];
}

async function updateEnvironmentVariables(keyOrId: string | number, value: string) {
    if (!keyOrId || !value) {
        throw new BadRequestError('更新环境变量消息格式有误，正确格式为：key=value 或 id=value');
    }

    let envToBeUpdated: GetAllEnvResponse | undefined;

    if (typeof keyOrId === 'string') {
        const allEnvironmentVariables = await getAllEnvironmentVariables();
        envToBeUpdated = allEnvironmentVariables.filter(env => env.name === keyOrId)[0];
        if (!envToBeUpdated) {
            throw new QingLongEnvNotFoundError(keyOrId);
        }
    } else {
        const allEnvironmentVariables = await getAllEnvironmentVariables();
        envToBeUpdated = allEnvironmentVariables.filter(env => env.id === keyOrId)[0];
        if (!envToBeUpdated) {
            throw new QingLongEnvNotFoundError(`ID: ${keyOrId}`);
        }
    }

    const updateEnvRequest: UpdateEnvRequest = {
        id: envToBeUpdated.id,
        name: envToBeUpdated.name,
        value: value
    };

    await doPutRequest<UpdateEnvRequest>(QingLongAPI.ENV, updateEnvRequest);
}

async function deleteEnvironmentVariable(envIds: number[]) {
    await doDeleteRequest(QingLongAPI.ENV, envIds);
}

async function getCronJobLog(jobName: string): Promise<string> {
    const allJobs = await getAllCronJobs();
    const jobToBeTriggered = allJobs.data.filter(job => job.name === jobName)[0];
    if (!jobToBeTriggered) {
        throw new QingLongJobNotFoundError(jobName);
    }

    const jobId = jobToBeTriggered.id;
    const jobLog = await doGetRequest<string>(util.format(QingLongAPI.GET_LOG, jobId));

    return jobLog.split('\n').join('\n\n');
}

async function doGetRequest<T>(path: string): Promise<T> {
    const response = await axios.get(
        `${baseUrl}${path}`,
        getAxiosRequestConfig()
    );

    const qingLongResponse = response.data as Response;
    ensureSuccessfulResponse(qingLongResponse);

    return qingLongResponse.data as T;
}

async function doPutRequest<T extends QingLongRequest>(path: string, data: T): Promise<void> {
    const response = await axios.put(
        `${baseUrl}${path}`,
        data,
        getAxiosRequestConfig(),
    );

    const qingLongResponse = response.data as Response;
    ensureSuccessfulResponse(qingLongResponse);
}

async function doPostRequest<T extends QingLongRequest>(path: string, data: T): Promise<void> {
    const response = await axios.post(
        `${baseUrl}${path}`,
        data,
        getAxiosRequestConfig(),
    );

    const qingLongResponse = response.data as Response;
    ensureSuccessfulResponse(qingLongResponse);
}

async function doDeleteRequest<T extends QingLongRequest>(path: string, data: T) {
    const response = await axios.delete(
        `${baseUrl}${path}`,
        {
            ...getAxiosRequestConfig(),
            data,
        },
    );

    const qingLongResponse = response.data as Response;
    ensureSuccessfulResponse(qingLongResponse);
}

function ensureSuccessfulResponse(response: Response) {
    const code = response.code;
    if (code !== 200) {
        const message = response.message || '发生了未知错误';
        throw new QingLongAPIError(message);
    }
}

function getAxiosRequestConfig(): object {
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

export {
    initializeQingLongAPIClient,
    addEnvironmentVariable,
    updateEnvironmentVariables,
    deleteEnvironmentVariable,
    getAllEnvironmentVariableKeys,
    getAllCronJobNames,
    triggerJob,
    getCronJobLog,
};
