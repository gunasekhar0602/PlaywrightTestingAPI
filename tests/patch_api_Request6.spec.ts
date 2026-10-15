
//pre - requists    data: json file
// 1) create a new booking (Post) ---> booking ID
// 2) Create a token for updating the booking   
// 3) Update booking(Put)  // required token

import{test,expect} from'@playwright/test'
import fs from 'fs';

// we can read any file by just providing file path as parameter
function readJson(filepath:string)
{
    // reading the file and returning the data in the file
    return JSON.parse(fs.readFileSync(filepath,'utf-8'))
}

test('update Booking(PUT)',async({request})=>
{
    // 1) Create a booking(post)
    // reading data from the file
    const createrequestbody=readJson("testdata/requestbody.json");

    // create a variable called url and mention the URL value in it
    const url="https://restful-booker.herokuapp.com/booking/"
    const createresponse=await request.post(`${url}`, {data:createrequestbody});
    expect(createresponse.ok()).toBeTruthy();

    
    const responsebody=await createresponse.json();
    console.log(responsebody)

    // extracting the bookingid from the responsebody
    const bookingid=responsebody.bookingid;
    console.log(bookingid)


    // 2) Update booking (PUT)  // required token
    // token creation

    const tokenrequestbody=readJson("testdata/token_requestbody.json");

    
    const tokenresponse=await request.post("https://restful-booker.herokuapp.com/auth",
                                                                    {data:tokenrequestbody});
    expect(tokenresponse.ok()).toBeTruthy();

    // extracting the token from the token response
    const tokenresponsebody=await tokenresponse.json();
    const token=tokenresponsebody.token;
    console.log("Token", token)


    // 3) Sending update (patch)

    // For update request along with the request we need to add token through headers
    const updaterequestbody =readJson("testdata/putrequestbody.json");

    const updateresponse=await request.patch(`${url}${bookingid}`,
                    {
                            headers:{"cookie":`token=${token}`},
                            // we need to pass the data regarding the update
                            data:updaterequestbody
        
                    })

    expect(updateresponse.ok()).toBeTruthy();
    expect(updateresponse.status()).toBe(200);

    const updateresponsebody=await updateresponse.json();
    console.log(updateresponsebody);
    console.log("Booking details updated successfully.....");

})