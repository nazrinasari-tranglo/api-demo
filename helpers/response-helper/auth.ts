import { APIResponse, expect } from "@playwright/test";

export async function validateSuccessAuth(response: APIResponse) {

    expect(response.status()).toBe(200);
    // console.log(response);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody).toHaveProperty('token');
    expect(typeof responseBody.token).toBe('string');

}

export async function validateBadRequest(response: APIResponse) {

    expect(response.status()).toBe(200);
    // console.log(response);
    const responseBody = await response.json();
    console.log(responseBody);
    expect(responseBody).not.toHaveProperty('token');
    expect(responseBody).toHaveProperty('reason');
    expect(responseBody.reason).toBe('Bad credentials');
    expect(typeof responseBody.reason).toBe('string');

}
