const contactCard = {
    "typeFormat" : "com.mydotcard.contact.0.0.2",
    "contact" : {
        "identifier" : "7210naiusdkkll89öoi3fks3jkf",
        "contactType" : "person/organzation",
        "birthday" : "2012-04-23T18:25:43.511Z",
        "namePrefix" : "Dr.",
        "givenName" : "Tim",
        "middleName" : "Timo",
        "familyName" : "Fleckenstein",
        "previousFamilyName" : "Fleckstone",
        "nameSuffix" : "Jr.",
        "nickname" : "Timi",
        "organizationName" : "Gesellschaft für Informatik",
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




let db = {
    users: [
      {
        userId: 'dh23ggj5h32g543j5gf43',
        email: 'user@email.com',
        handle: 'user',
        createdAt: '2019-03-15T10:59:52.798Z',
        imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
        bio: 'Hello, my name is user, nice to meet you',
        website: 'https://user.com',
        location: 'Lonodn, UK'
      }
    ],
    screams: [
      {
        userHandle: 'user',
        body: 'This is a sample scream',
        createdAt: '2019-03-15T10:59:52.798Z',
        likeCount: 5,
        commentCount: 3
      }
    ],
    comments: [
      {
        userHandle: 'user',
        screamId: 'kdjsfgdksuufhgkdsufky',
        body: 'nice one mate!',
        createdAt: '2019-03-15T10:59:52.798Z'
      }
    ],
    notifications: [
      {
        recipient: 'user',
        sender: 'john',
        read: 'true | false',
        screamId: 'kdjsfgdksuufhgkdsufky',
        type: 'like | comment',
        createdAt: '2019-03-15T10:59:52.798Z'
      }
    ]
  };
  const userDetails = {
    // Redux data
    credentials: {
      userId: 'N43KJ5H43KJHREW4J5H3JWMERHB',
      email: 'user@email.com',
      handle: 'user',
      createdAt: '2019-03-15T10:59:52.798Z',
      imageUrl: 'image/dsfsdkfghskdfgs/dgfdhfgdh',
      bio: 'Hello, my name is user, nice to meet you',
      website: 'https://user.com',
      location: 'Lonodn, UK'
    },
    likes: [
      {
        userHandle: 'user',
        screamId: 'hh7O5oWfWucVzGbHH2pa'
      },
      {
        userHandle: 'user',
        screamId: '3IOnFoQexRcofs5OhBXO'
      }
    ]
  };
  