import { test, expect } from '@playwright/test';
import * as testData from '../test-data/auth-test-data.json'
import { config } from '../config/config.env'
import { postRequestAuth } from '../helpers/request-helper/auth'
import { validateSuccessAuth, validateBadRequest } from '../helpers/response-helper/auth'


// const url = config.baseUrl;

// test('verify success response when auth with valid credentials', async ({ request }) => {
//     const response = await postRequestAuth(url, request, testData.validCredentials)
//     await validateSuccessAuth(response);
// });

// test('verify success response when auth with wrong username', async ({ request }) => {
//     const response = await postRequestAuth(url, request, testData.wrongUsername)
//     await validateBadRequest(response);
// });

// test('verify success response when auth with wrong password', async ({ request }) => {
//     const response = await postRequestAuth(url, request, testData.wrongPassword)
//     await validateBadRequest(response);
// });


// test('verify success response when auth with empty credentials', async ({ request }) => {
//     const response = await postRequestAuth(url, request, testData.emptyCredentials)
//     await validateBadRequest(response);
// });

test.describe('All requests', async () => {
    let token: string = '';
    test.describe.configure({ mode: 'serial' })
    test('Auth', async ({ request }) => {
        const response = await request.post('token-url-here', {
            form:
            {
                //auth here

            },
            ignoreHTTPSErrors: true
        })



        const responseBody = await response.json();
        token = responseBody.access_token;
    });

    test('DoPayment', async ({ request }) => {
        const response = await request.post('payment API here', {
            headers: {
                'Authorization': `Bearer ${token}`
            },
            data:
            {
                //    sample data here
            },
            ignoreHTTPSErrors: true
        })

        console.log(await response.json());
    });
});