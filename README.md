
# REST API Docs my.card

## Open Endpoints

Open endpoints require no Authentication.

* [SignUp](doc/signup.md) : `POST /api/signup/`
* [Login](doc/login.md) : `POST /api/login/`
* [Get Card](doc/getcard.md) : `GET /api/card/:card_id/:format/`


## Endpoints that require Authentication

Closed endpoints require a valid Bearer Token to be included in the header of the
request. A Token can be acquired from the Login or SignUp view above.

### Protected Endpoints

Each endpoint relates to the User whose Token is provided with the request:

* [Create card](doc/createcard.md) : `POST /api/createCard/`
* [Update card](doc/updatecard.md) : `POST /api/updateCard/`
* [Get all cards of user](doc/getcards.md) : `GET /api/cards/`
* [Exchange cards](doc/exchange.md) : `POST /api/exchange/`


