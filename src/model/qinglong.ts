interface UpdateEnvRequest {
    id: number,
    name: string,
    value: string,
}

interface Response {
    code: number,
    message?: string,
    data?: LoginResult | GetAllEnvResponse | any,
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

export {
    UpdateEnvRequest,
    Response,
    LoginResult,
    GetAllEnvResponse,
}
