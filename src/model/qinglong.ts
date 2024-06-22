interface UpdateEnvRequest {
    id: number,
    name: string,
    value: string,
}

interface Response {
    code: number,
    message?: string,
    data?: LoginResult | GetAllEnvResponse[] | GetAllCronJobResponse[],
}

interface LoginResult {
    token: string,
    tokenType: string,
    expiration: number
}

interface GetAllEnvResponse {
    id: number,
    name: string,
    value: string,
    remarks: string,
    status: number,
    timestamp: string,
    position: bigint,
    createdAt: string,
    updatedAt: string
}

interface GetAllCronJobResponse {
    data: GetAllCronJobData[],
    total: number
}

interface GetAllCronJobData {
    id: number,
    name: string,
    command: string,
    schedule: string,
    timestamp: string,
    saved: boolean,
    status: number,
    isSystem: number,
    pid: number,
    isDisabled: number,
    isPinned: number,
    logPath: string,
    labels: string[],
    lastRunningTime: number,
    lastExecutionTime: number,
    createdAt: string,
    updatedAt: string,
}

export {
    UpdateEnvRequest,
    Response,
    LoginResult,
    GetAllEnvResponse,
    GetAllCronJobResponse,
}
