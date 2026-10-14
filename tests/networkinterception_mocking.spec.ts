// API Mocking and network interception Demo

// application URL - https://demo.playwright.dev/api-mocking

// response URL - https://demo.playwright.dev/api-mocking/api/v1/fruits

import{test,expect} from'@playwright/test'

// Example 1 - 
test("Mocking api response",async({page})=>
{
    // step 1 : Intercept the API URL pattern before navigating
    // first * - https://demo.playwright.dev
    // second * - api-mocking
    // ** is pattern matching
    await page.route("**api/v1/fruits",async(route)=>
    {
        const fakeresponse=
        [
            {name:"XYZ", id:1},
            {name:"ABC",id:2}
        ];

    // step 2 : Fullfill the request with your mock data
    await route.fulfill({
        status:200,
        contentType:'applocation/json',
        body:JSON.stringify(fakeresponse)
    })

    })

    // stpe 3 : Go to the page and verofy the UI displays the mocked data

    await page.goto('https://demo.playwright.dev/api-mocking')
    await expect (page.getByText("XYZ")).toBeVisible();
    await expect (page.getByText("ABC")).toBeVisible();
    
    await page.waitForTimeout(5000)
    
})






// Example 2 - Modify a live API response using API request
// We cannot mock API request directly
test ("Modify the API response",async({request})=>
{
    const response=await request.get("https://demo.playwright.dev/api-mocking/api/v1/fruits");
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const fruits=await response.json()
    console.log("Fruits",fruits)

})








// Example 3 -

test("Modify a live API response",async({page})=>
{
    await page.route("**/api/v1/api",async(route)=>
    {
        // 1. Fetch the acutal response from ther server
        // fetch will fetch the response from the server and give it to the response variable
        const response=await route.fetch();

        // here we are get the response body into json method
        const json=await response.json();
        console.log(json)

        // 2. Append OR patch the real data
        json.push({name:'XYZ',id:100});
        console.log(json);

        // 3. Fullfill the route with the modified data
        await route.fulfill({
            response,
            json
        })
    })
    await page.goto(" https://demo.playwright.dev/api-mocking")
    await page.waitForTimeout(5000)
    await expect(page.getByText('XYZ')).toBeVisible({timeout:5000});

})











// Example 4 - Network Interception - Block Specific image extensions

test.only('Image blocking',async({page})=>
{
    await page.route("**/*.{png,jpg,jpeg,gif,svg,webp}", async(route)=>
    {
        console.log(route.request().url())
        await route.abort()
    })

    await page.goto("https://demoblaze.com")
    await page.waitForTimeout(5000)
})