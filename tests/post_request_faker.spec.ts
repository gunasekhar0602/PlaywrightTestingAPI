 /* 
Test - create booking
Request type - post
Request body - randon/dynamic (faker)
pre-requistes:

Install faker-js library for genrating dynamic data
npm install @faker-js/faker

Install Luxon is a library for working with dates and times in JavaScript
npm install luxon

*/

// Here are getting the request body details from the json file.

import{test,expect}from'@playwright/test'
import{faker} from"@faker-js/faker"
import{DateTime}from "luxon";

test('create request using static body',async({request})=>
{
    // Data generation using faker library
    const firstname=faker.person.firstName()
    const lastname=faker.person.lastName()
    const totalprice=faker.number.int({min:100,max:5000})
    const depositpaid=faker.datatype.boolean()
    const checkin=DateTime.now().toFormat("yyyy-mm-dd")
    const checkout=DateTime.now().plus({day:5}).toFormat("yyyy-mm-dd")

    //requestbody(faker)
    const requestbody=
    {
        firstname:firstname,
        lastname:lastname,
        totalprice:totalprice,
        depositpaid:depositpaid,
        bookingdates:{
            checkin:checkin,
            checkout:checkout,
        },
        additionalneeds:"super bowls"
    }

    // send post request and capture in response
    // for posting request we need to mention the url and requestbody
    const baseurl='https://restful-booker.herokuapp.com/booking'
    const response=await request.post(baseurl,{data:requestbody})

    const responsebody=await response.json()   // returns the body from response
    console.log(responsebody)

    // validation of status code
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200)

    // validate response body
    expect(responsebody).toHaveProperty("bookingid")
    expect(responsebody).toHaveProperty("booking")
    expect(responsebody).toHaveProperty("booking.additionalneeds")


    // validate booking details

    const booking=responsebody.booking

    expect(responsebody.booking).toMatchObject({
        firstname:requestbody.firstname,
        lastname:requestbody.lastname,
        totalprice:requestbody.totalprice,
        depositpaid:requestbody.depositpaid,
        additionalneeds:requestbody.additionalneeds,
        });

    // validate booking dates
    expect(booking.bookingdates).toMatchObject({
        checkin:requestbody.bookingdates.checkin,
        checkout:requestbody.bookingdates.checkout,
    })

})
