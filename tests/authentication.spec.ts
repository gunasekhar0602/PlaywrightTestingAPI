// API Authentication
import {test, expect} from '@playwright/test'

// 1) No Auth(public API)
// No Authentication is required for public API
test('No Authentication', async({request})=>
{
    // step 1 - send the GET request and capture the response
    const response=await request.get('https://jsonplaceholder.typicode.com/posts/1');

    // step 2 - verify the status code
    expect(response.status()).toBe(200);

    // step 3 - Read the response body
    const responsebody=await response.json();
    console.log(responsebody);

    // step 4 - Validate the response body
    expect(responsebody.userId).toBe(1);
    expect(responsebody.id).toBe(1);
    expect(responsebody).toHaveProperty('title');
    expect(responsebody).toHaveProperty('body');
})





import { Buffer } from 'node:buffer'; // to encode the data
import dotenv from'dotenv' // Import the dotenv package
dotenv.config(); // Load environmental varaibles from .env file

// 2. Basic Authentication
test('Basic Authentication', async({request})=>
{
    // proccess is module
    // by using the proccess module we can get the env file and the variables in it
    const username=process.env.BASIC_AUTH_USERNAME;
    const password=process.env.BASIC_AUTH_PASSWORD;

    // buffer is package which will encode the username and password
    // base64 will change the username and passowrd to encoded string formate.
    const base64Credentals=Buffer.from(`${username}:${password}`).toString('base64');
    console.log("encode string", base64Credentals);

    // send the GET request and capture the response
    const response=await request.get('https://postman-echo.com/basic-auth',
    {
        headers:
            {
                // we need to pass the encode string value in headers
                // Manually setting Basic Auth header (alternative method)
                // Authorization is a random keyword
                // Basic is type of authentication
                Authorization:`Basic ${base64Credentals}`
            }
        });

    expect(response.status()).toBe(200);
    const responsebody=await response.json();
    console.log(responsebody);
    expect(responsebody.authenticated).toBe(true);

})






// 3. API Key Authetication
test ("API key authentication (open weather API)",async ({request})=>
{
    // proccess is module
    // by using the proccess module we can get the env file and the variables in it
    const apikey=process.env.OPENWEATHER_API_KEY
    const city="Delhi"

    const response=await request.get(`https://api.openweather.org/data/2.5/weather`,
        {
            params:
            {
                q:"Delhi",
                apiid:apikey!,     // ! represent not null
            }
        }
    )

    expect(response.status()).toBe(200);
    const weatherdata=await response.json();
    console.log(weatherdata);

    expect(weatherdata.name).toBe(city);
    expect(weatherdata).toHaveProperty("weather");
    expect(weatherdata).toHaveProperty("main");
})



// 4. Bearer token authentication
test('Bearer token authentication - Get user Repositories', async ({request})=>
{
    // proccess is module
    // by using the proccess module we can get the env file and the variables in it
    const github_token=process.env.GITHUB_TOKEN

    const response=await request.get('https://api.github.com/user/repos',
        {
            headers:
            {
                // we need to pass the bearer token in the headers
                // Bearer is type of authentication.
                Authorization:`Bearer ${github_token}`
            }
        }
    )
    expect(response.status()).toBe(200);
    const repositories=await response.json();
    console.log(repositories);

    // printing the repositoriy names
    for(let repo of repositories)
    {
        console.log(repo.name);
    }
})
















const GIT_CONFIG=
{
    clientId:process.env.GITHUB_CLIENT_ID!,
    clientSecret:process.env.GITHUB_CLIENT_SECRET!,
    authorizationCode:process.env.GITHUB_AUTHORIZATION_CODE!,
    tokenUrl:process.env.GITHUB_TOKEN_URL!,
    apiBaseUrl:process.env.GITHUB_API_BASE_URL!,
    owner:process.env

}

let accessToken=" "
let repoName=" "
test.describe.serial("login feature", async()=>
{
    // ----------------------------------------------------
    // Test 1 : Generate access token 
    // ----------------------------------------------------

    test ('Generate OAuth2 Access Token', async({request})=>
    {
        const response=await request.post(GIT_CONFIG.tokenUrl,{
            headers:
            {
                Accept:'application/json'
            },
            form:
            {
                client_id:GIT_CONFIG.clientId,
                client_secret:GIT_CONFIG.clientSecret,
                code:GIT_CONFIG.authorizationCode
            }
        })

        expect(response.status()).toBe(200);
        const body=await response.json();
        accessToken=body.access_token;

        console.log("Token :", accessToken)
        expect(accessToken).toBeTruthy();
        console.log("Access Token Generated Successfully");
    })


    test("Create repository",async({request})=>
    {
        repoName=`Playwright-repo-${Date.now()}`;

        const response=await request.post(
            `${GIT_CONFIG.apiBaseUrl}/user/repos`,
            {
                headers:
                {
                    Authorization:`Bearer ${accessToken}`,
                    Accept:'application/vnd.github+json'
                },
                data:
                {
                    name:repoName,
                    description:'Repository created by using Playwright',
                    private:false
                }
            }
        );

        expect(response.status()).toBe(201);
        const responsebody=await response.json();
        expect(responsebody.name).toBe(repoName);

        console.log("Repository Created Successfully")
    })
})













/* 

=================================================================================
// GItHub OAuth2 Authentication + API Chaning
=================================================================================
// Pre-requisites
---------------------
step 1 - Manually create an OAuth App in GitHub (It will give Client ID and Client Secret)

step 2 - Manually get the Client ID and Client Secret from the OAuth App.
store them in .env file

step 3 - Generate teh Authorization Code manually by opening the authorization
         url in the browser
Store the authorization code in the .env file

step 4 - Exchange the Authorization Code for an Access token.
(This is done automatically in the first test)

step 5 - Reuse the same Access Token in all remaining tests

 */


// https://github.com/login/oauth/authorize?client_id=Ov23li8BXLUXv9tJNhSJ&scope=repo,user&redirect_uri=https://localhost:3000/callback