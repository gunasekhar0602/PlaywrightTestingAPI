import {test, expect} from'@playwright/test'
import Ajv2020 from 'ajv/dist/2020';

test("Schema validation",async({request})=>
{
    // step 1 - Send request and get the response
    const response = await request.get('https://mocktarget.apigee.net/json');

    // get response body
    const responsebody=await response.json();

    // print response body
    console.log(responsebody);



    // step 2 - Define the schema
    const schema=
    {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Generated Schema",
  "type": "object",
  "properties": {
    "firstName": {
      "type": "string"
    },
    "lastName": {
      "type": "string"
    },
    "city": {
      "type": "string"
    },
    "state": {
      "type": "string"
    }
  },
  "required": [
    "firstName",
    "lastName",
    "city",
    "state"
  ]
}

    // step 3 - Check response against schema
    const ajv=new Ajv2020();
    const validate=ajv.compile(schema);  

    // retruns true OR false
    const isValid=validate(responsebody);    
    
    // assertion
    expect(isValid).toBeTruthy();

})


