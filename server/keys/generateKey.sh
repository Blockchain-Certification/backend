#!/bin/bash

# Generate private key
openssl genrsa -out private_key.pem 2048

# Generate public key
openssl rsa -in private_key.pem -out public_key.pem -pubout
