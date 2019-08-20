# Get Card by ID

Get the card details as json or URL to vcard

**URL** : `/api/card/:card_id/:format/`

**URL Parameters** : `card_id` is the ID of the card and `format` is either `json` or `vcard`

**Method** : `GET`

**Auth required** : NO

## Success Response

**Code** : `200 OK`

**Content examples**

For a User with ID 578b8ce0-c215-11e9-b44d-e5b2667ffbc2 and `format` json

```json
{
    "typeFormat": "0.",
    "contact": {
        "nickname": "Timi",
        "departmentName": "Theoretische Informatik",
        "contactType": "person/organzation",
        "nameSuffix": "Jr.",
        "familyName": "ItWorrkedAgaiin",
        "note": "My best friend :-)",
        "organizationName": "mycard inc",
        "urls": [
            {
                "identifier": "url1",
                "url": "https://tim-flecky-international-corparation.com",
                "label": "Company Website"
            }
        ],
        "emails": [
            {
                "identifier": "email1",
                "mail": "timi@flecky-international.com",
                "label": "business"
            }
        ],
        "imageData": "öldkjafjöalksdjöflkadsjföalksdjföaslkdfjaösldkfjasödlkfjaödflkjasölkdfj...",
        "namePrefix": "",
        "previousFamilyName": "Fleckstone",
        "birthday": "2012-04-23T18:25:43.511Z",
        "identifier": "tester",
        "phoneNumbers": [
            {
                "identifier": "phoneNumber1",
                "phoneNumber": "+490163249732",
                "label": "Home"
            }
        ],
        "postalAddresses": [
            {
                "data": {
                    "postalCode": "10969",
                    "city": "Berlin",
                    "state": "Berlin",
                    "country": "Germany",
                    "isoCountryCode": "DE",
                    "street": "Main Street"
                },
                "label": "Private",
                "identifier": "address1"
            }
        ],
        "middleName": "noo",
        "givenName": "Philip",
        "socialProfiles": [
            {
                "identifier": "socialProfiles1",
                "service": "Facebook",
                "username": "tim.flecki",
                "url": "https://facebook.com/tim.flecki"
            },
            {
                "service": "Snapchat",
                "username": "Tflecki",
                "url": "https://snapchat.com/add/tim.flecki",
                "identifier": "socialProfiles2"
            }
        ],
        "jobTitle": "Senior Developer"
    }
}
```

For a User with ID 578b8ce0-c215-11e9-b44d-e5b2667ffbc2 and `format` vcard

```URL
https://firebasestorage.googleapis.com/v0/b/mycard-93892.appspot.com/o/578b8ce0-c215-11e9-b44d-e5b2667ffbc2.vcf?alt=media
```

