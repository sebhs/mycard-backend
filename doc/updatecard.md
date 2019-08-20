# Create Card by ID

Get the card details as json or URL to vcard

**URL** : `/api/updateCard/`


**Method** : `POST`

**Auth required** : YES

**Data constraints**

Provide card_id, card_type, and contact body.

```json
{
    "card_id":"[ID of card]"
    "card_type": "[type of card]",
    "body":"[contact JSON]"
}
```

**Data example** All fields must be sent.

```json
{
   "card_id":"602a0c30-c32a-11e9-5c34-5f4c3b2b1a4e",
   "card_type":"casual",
   "body": {
   	"typeFormat" : "0.",
    "contact" : {
        "identifier" : "xxx",
        "contactType" : "person",
        "birthday" : "2012-04-23T18:25:43.511Z",
        "namePrefix" : "",
        "givenName" : "Tim",
        "middleName" : "noo",
        "familyName" : "Fleckstein",
        "previousFamilyName" : "Fleckstone",
        "nameSuffix" : "Jr.",
        "nickname" : "Timi",
        "organizationName" : "mycard inc",
        "departmentName" : "Theoretische Informatik",
        "jobTitle" : "Senior Developer",
        "note" : "My best friend :-)",
        "imageData" : "öldkjafjöalksdjöflkadsjföalksdjföaslkdfjaösldkfjasödlkfjaödflkjasölkdfj...",
        "socialProfiles" : [
            {
                "identifier" : "socialProfiles1",
                "service" : "Facebook",
                "url" : "https://facebook.com/tim.flecki",
                "username" : "tim.flecki"
            },
            {
                "identifier" : "socialProfiles2",
                "service" : "Snapchat",
                "url" : "https://snapchat.com/add/tim.flecki",
                "username" : "Tflecki"
            }
        ],
        "phoneNumbers" : [
            {
                "identifier" : "phoneNumber1",
                "label" : "Home",
                "phoneNumber" : "+490163249732"
            }
        ],
        "urls" : [
            {
                "identifier" : "url1",
                "label" : "Company Website",
                "url" : "https://tim-flecky-international-corparation.com"
            }
        ],
        "postalAddresses" : [
            {
                "identifier" : "address1",
                "label" : "Private",
                "data" : {
                    "street" : "Main Street",
                    "city" : "Berlin",
                    "state" : "Berlin",
                    "postalCode" : "10969",
                    "country" : "Germany",
                    "isoCountryCode" : "DE"
                }
            }
        ],
        "emails" : [
            {
                "identifier" : "email1",
                "label" : "business",
                "mail" : "timi@flecky-international.com"
            }
        ]
    }
	}
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "message": "Card updated successfully"
}
```



