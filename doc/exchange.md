# Exchange contacts

Exchanges contacts by adding the the card_ids to the subs of the respective users. TODO: describe in more detail what exchange does

**URL** : `/api/createCard/`


**Method** : `POST`

**Auth required** : YES

**Data constraints**

Provide card_id of receiver and location of scanner.

```json
{
    "card_id":"[ID OF CARD]",
	"location": {
		"lat":"[LATITUDE COORDINATE]",
		"lng":"[LONGITUDE COORDINATE]"
	}
}
```

**Data example** All fields must be sent.

```json
{
    "card_id":"478b8ca0-c2c5-12e9-b94d-e5bf667ffbc2",
	"location": {
		"lat":"0.0",
		"lng":"0.0"
	}
}
```

## Success Response

**Code** : `200 OK`

**Content examples**

```json
{
    "exchange_id": "d0e77891-c2c6-11e9-2e77-ef0c6aa4e317"
}
```



