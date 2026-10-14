
// Creating a request - POST      - Test Data is Static
import{test,expect}from'@playwright/test'

// request is inbuilt playwright fixture for performing API Testing
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

    // Create a varible as baseurl and mention the URL
    const baseurl='https://restful-booker.herokuapp.com/booking'

    // send post request and capture in response
    // for posting request we need to mention the url and requestbody
    // request body is mentioned through the data
    const response=await request.post(baseurl,{data:requestbody});

    // returns the responsebody from response
    const responsebody=await response.json(); 
    console.log(responsebody);

    // validation of status code
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // validate response body.   
    // Use (toHaveProperty) while validating the response body
    expect(responsebody).toHaveProperty("bookingid");
    expect(responsebody).toHaveProperty("booking");
    expect(responsebody).toHaveProperty("booking.additionalneeds");

    // validate booking details
    const booking=responsebody.booking

    // assertions for responsebody
    expect(responsebody.booking).toMatchObject({
        firstname:"Jim", lastname:"Brown", totalprice:1000, depositpaid:true,
        additionalneeds:"super bowls",
        });

    // validate booking dates
    expect(booking.bookingdates).toMatchObject({checkin:"2025-07-01",
            checkout:"2025-07-05",});

})
