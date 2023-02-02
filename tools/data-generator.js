const Crypto = require('crypto')

export function randomString(size = 10) {
    return Crypto
        .randomBytes(size)
        .toString('base64')
        .slice(0, size)
}