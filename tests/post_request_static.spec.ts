/* 
Test - create booking    Request type - post     Request body - static
*/

// Creating a request - POST 
import{test,expect}from'@playwright/test'
// request is inbuilt playwright fixture
test('create request using static body',async({request})=>
{
    // request body will be in JSON formate
    const requestbody=
    {
        "firstname":"Jim",
        "lastname":"Brown", 
        "totalprice":1000,
        "depositpaid":true,
        "bookingdates":{
            "checkin":"2025-07-01", 
            "checkout":"2025-07-05",
        },
        "additionalneeds":"super bowls"
    }

    // send post request and capture in response
    // for posting request we need to mention the url and requestbody

    // Create a varible as baseurl and mention the URL
    const baseurl='https://restful-booker.herokuapp.com/booking'

    const response=await request.post(baseurl,{data:requestbody});

    const responsebody=await response.json();   // returns the body from response
    console.log(responsebody);

    // validation of status code
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // validate response body.   Use (toHaveProperty) while validating the response body
    expect(responsebody).toHaveProperty("bookingid");
    expect(responsebody).toHaveProperty("booking");
    expect(responsebody).toHaveProperty("booking.additionalneeds");

    // validate booking details
    const booking=responsebody.booking

    expect(responsebody.booking).toMatchObject({
        firstname:"Jim", lastname:"Brown", totalprice:1000, depositpaid:true,
        additionalneeds:"super bowls",
        });

    // validate booking dates
    expect(booking.bookingdates).toMatchObject({checkin:"2025-07-01",
            checkout:"2025-07-05",});

})
