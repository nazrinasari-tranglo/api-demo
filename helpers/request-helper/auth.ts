import { APIRequestContext } from "@playwright/test";

export async function postRequestAuth(url: string, request: APIRequestContext, testData: Record<string, string>) {

    return await request.post(url, {
        data: testData
    }
    );



}
