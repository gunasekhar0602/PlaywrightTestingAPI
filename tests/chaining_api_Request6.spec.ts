// Patch Request

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

test('Create booking, update booking and delete booking',async({request})=>
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


    // 2) Token creation for updating the data

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
    const partial_updaterequestbody =readJson("testdata/patch_requestbody.json");

    const partial_updateresponse=await request.patch(`${url}${bookingid}`,
                    {
                            headers:{
                                "cookie":`token=${token}`
                            },
                            // we need to pass the data regarding the update
                            data:partial_updaterequestbody
        
                    })

    expect(partial_updateresponse.ok()).toBeTruthy();
    expect(partial_updateresponse.status()).toBe(200);

    const partial_updateresponsebody=await partial_updateresponse.json();
    console.log(partial_updateresponsebody);
    console.log("Booking details updated successfully.....");


    // step 4 - Full update the booking

    // Read the file and store it in a varaible - full_updaterequestbody
    const full_updaterequestbody=readJson("testdata/put_requestbody.json")

    // capture the update response by passing 
    const full_updateresponse=await request.put(`${url}${bookingid}`,
        {
            headers:{
                "Cookie":`${token}`
            },
            data:full_updaterequestbody
        })

    expect(full_updateresponse.status()).toBe(200)
    const full_updateresponsebody=await full_updateresponse.json()
    console.log(full_updateresponsebody)
    console.log("Booking details updated successfully")




    // 5. Delete Booking
    const deleteresponse=await request.delete(`${url}${bookingid}`,
        {
            headers:
            {
                "cookie":`token:${token}`
            }

        });
    expect(deleteresponse.status()).toBe(200);
    console.log('Booking details deleted successfully') 

})