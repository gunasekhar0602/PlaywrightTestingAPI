// Creating a request - POST  
// Here are getting the request body details from the json file.

import{test,expect}from'@playwright/test'

// npm install fs
import fs from 'fs';  // for getting file

test('create request using JSON file',async({request})=>
{
    // read data from json(request body)
    const jsonFile="testdata/requestbody.json"

    // JSON is predeifned class, inside that we are calling parse method.
    // it will read the data in array formate.
    // Reading and parsing the JSON Data --------------------------------------------------------------------------------------
    // fs.readFilesync(jsonpath,'utf-8') - Reads JSON file synchronously
    // jsonpath - storing the relative path of JSON file which contains test data
    // UTF-8 - Unicode Transformation Format - it is required when dealing with 
                              // JSON and CSV files to ensure standard text encoding

    // JSON.parse() - which converts the raw UTF-8 string into JavaScript array/object format(logindata)
    // parse method will take - fs.readFileSync(jsonpath,'utf-8') as parameter
    // create a varible requestbody
    const requestbody:any=JSON.parse(fs.readFileSync(jsonFile,'utf-8'));

    // send post request and capture in response
    // for posting request we need to mention the url and requestbody

    const baseurl='https://restful-booker.herokuapp.com/booking'
    const response=await request.post(baseurl,{data:requestbody});

    const responsebody=await response.json()   // returns the body from response
    console.log(responsebody)

    // validation of status code
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    // validate response body
    expect(responsebody).toHaveProperty("bookingid");
    expect(responsebody).toHaveProperty("booking");
    expect(responsebody).toHaveProperty("booking.additionalneeds");

    // validate booking details
    const booking=responsebody.booking

// here no need to hardcore the values instead say resquestbody.property
    expect(booking).toMatchObject({
        firstname:requestbody.firstname, lastname:requestbody.lastname,
        totalprice:requestbody.totalprice, depositpaid:requestbody.depositpaid,
        additionalneeds:requestbody.additionalneeds,
        });

    // validate booking dates
    expect(booking.bookingdates).toMatchObject({
        checkin:requestbody.bookingdates.checkin,
        checkout:requestbody.bookingdates.checkout,
    })
})
