# LOGIN

Used to collect create a new User.

**URL** : `/api/login/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "email":"[valid email address]",
    "password":"[password in plain text]",

}
```

**Data example**

```json
{
    "email":"seb@email.com",
	"password":"abcd1234",
}
```

## Success Response

**Code** : `200 OK`

**Content example**

```json
{
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjI2OGNhNTBjZTY0YjQxYWIzNd"
}
```

## Error Response

**Condition** : If 'email' is empty

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "email": "Must not be empty"
}
```

**Condition** : If 'password' is empty

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "password": "Must not be empty"
}
```

**Condition** : If wrong password or user not found

**Code** : `403 FORBIDDEN ERROR`

**Content** :

```json
{
    "general": "Email and password did not match. Please try again."
}
```
