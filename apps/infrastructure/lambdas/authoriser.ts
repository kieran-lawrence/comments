import { APIGatewayProxyEventV2 } from 'aws-lambda'

export const handler = async (event: APIGatewayProxyEventV2) => {
    const apiKey = event.headers['x-api-key']
    if (!process.env.API_KEY || !apiKey) {
        return {
            isAuthorized: false,
        }
    }
    if (apiKey === process.env.API_KEY) {
        return {
            isAuthorized: true,
        }
    }
    return {
        isAuthorized: false,
    }
}
