export default class Secrets {

    static AlgoName = 'AES-CBC'
    static PrefixLength = 16

    static #utf8Encode(plainText) {
        const enc = new TextEncoder()
        return enc.encode(plainText ?? '')
    }

    static async #getKey(password, salt = null) {
        const pass = Secrets.#utf8Encode(password)
        salt = salt || crypto.getRandomValues(
            new Uint8Array(Secrets.PrefixLength))

        const rawKey = await crypto.subtle.importKey(
            'raw',
            pass,
            { name: 'PBKDF2' },
            false,
            ['deriveKey'])

        const key = await crypto.subtle.deriveKey(
            {
              name: 'PBKDF2',
              salt: salt,
              iterations: 100000,
              hash: 'SHA-512'
            },
            rawKey,
            {name: Secrets.AlgoName, length: 256},
            true,
            ['encrypt', 'decrypt']
          )
        
          return { key, salt }
    }

    // { message, password }
    static async encode(data) {
        const secret = await Secrets.#getKey(data.password)
        const iv = crypto.getRandomValues(
            new Uint8Array(Secrets.PrefixLength))
        const encoded = new Uint8Array(
            await crypto.subtle.encrypt(
                {
                    name: Secrets.AlgoName,
                    iv,
                },
                secret.key,
                Secrets.#utf8Encode(data.message),
            ))
        const result = new Uint8Array(secret.salt.byteLength +
                iv.byteLength + encoded.byteLength)
        result.set(secret.salt, 0)
        result.set(iv, secret.salt.byteLength)
        result.set(encoded, secret.salt.byteLength + iv.byteLength)
        return btoa(result)
    }

    // { message, password }
    static async decode(data) {
        const tmp = Uint8Array.from(
            atob(data.message).split(','), c => parseInt(c))
        const salt = new Uint8Array(Secrets.PrefixLength)
        const iv = new Uint8Array(Secrets.PrefixLength)
        salt.set(tmp.subarray(0, Secrets.PrefixLength), 0)
        iv.set(tmp.subarray(Secrets.PrefixLength,
            2 * Secrets.PrefixLength), 0)
        const encoded = new Uint8Array(tmp.length - 2 * iv.byteLength)
        encoded.set(tmp.subarray(2 * iv.byteLength), 0)
        const secret = await Secrets.#getKey(data.password, salt)
        const plain = await crypto.subtle.decrypt(
                {
                    name: Secrets.AlgoName,
                    iv
                },
                secret.key,
                encoded
            )
        return new TextDecoder().decode(new Uint8Array(plain))
    }
}
