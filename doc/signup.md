# SIGN UP

Used to collect create a new User.

**URL** : `/api/signup/`

**Method** : `POST`

**Auth required** : NO

**Data constraints**

```json
{
    "email":"[valid email address]",
    "password":"[password in plain text]",
	"confirmPassword":"[password in plain text]"

}
```

**Data example**

```json
{
    "email":"seb@email.com",
    "password":"abcd1234",
	"confirmPassword":"abcd1234"
}
```

## Success Response

**Code** : `201 CREATED`

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


**Condition** : If 'email' is invalid

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "email": "Must be a valid email address"
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

**Condition** : If 'password' and 'confirmPassword' don't match

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "password": "Passwords must match"
}
```

**Condition** : If 'email' already in use

**Code** : `400 BAD REQUEST`

**Content** :

```json
{
    "password": "email is already in use"
}
```