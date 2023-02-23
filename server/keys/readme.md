GENERATE PRIVATE KEY

```sh
openssl genrsa -out private_key.pem 2048

```

```sh
GENERATE PUBLIC KEY
```

```sh
openssl rsa -in private_key.pem -out public_key.pem -pubout

```
