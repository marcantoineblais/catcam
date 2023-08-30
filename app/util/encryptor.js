"use client"

async function generateBrowserSpecificKey() {
    const combinedData = navigator.userAgent + navigator.languages + navigator.mediaCapabilities + navigator.maxTouchPoints + navigator.mediaSession + navigator.storage
    const encoder = new TextEncoder()
    const combinedDataBuffer = encoder.encode(combinedData)

    // Use PBKDF2 for key derivation
    const salt = new Uint8Array(16) // A random salt for added security
    const iterations = 100000 // Number of iterations (adjust as needed)
    const keyLength = 256 // Desired key length in bits

    // Derive the key material using PBKDF2
    const keyMaterial = await crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt,
            iterations,
            hash: 'SHA-256'
        },
        await crypto.subtle.importKey(
            'raw',
            combinedDataBuffer,
            { name: 'PBKDF2' },
            false,
            ['deriveKey']
        ),
        { name: 'AES-CBC', length: keyLength },
        true, // This should be set to true to allow exporting the key
        ['encrypt', 'decrypt']
    );

    return await crypto.subtle.exportKey('raw', keyMaterial)
}

// Convert a string to an ArrayBuffer
function stringToArrayBuffer(str) {
    var encoder = new TextEncoder()
    return encoder.encode(str)
}

// Convert an ArrayBuffer to a hex string
function arrayBufferToHexString(buffer) {
    return Array.from(new Uint8Array(buffer)).map(byte => byte.toString(16).padStart(2, '0')).join('')
}

export async function encryptData(data) {
    // Convert the data and encryption key to ArrayBuffers
    const key = await generateBrowserSpecificKey()
    const dataBuffer = stringToArrayBuffer(data)
    const keyBuffer = await crypto.subtle.importKey('raw', key, 'AES-CBC', false, ['encrypt'])

    // Generate a random IV (Initialization Vector)
    const iv = crypto.getRandomValues(new Uint8Array(16))

    // Encrypt the data using AES-CBC
    const encryptedDataBuffer = await crypto.subtle.encrypt(
        { name: 'AES-CBC', iv }, keyBuffer, dataBuffer
    )

    // Combine the IV and encrypted data into a single ArrayBuffer
    const encryptedBuffer = new Uint8Array(iv.byteLength + encryptedDataBuffer.byteLength)
    encryptedBuffer.set(iv)
    encryptedBuffer.set(new Uint8Array(encryptedDataBuffer), iv.byteLength)

    // Convert the encrypted ArrayBuffer to a hex string
    const encryptedHexString = arrayBufferToHexString(encryptedBuffer)
    return encryptedHexString
}

export async function decryptData(encryptedData) {
    // Convert the hex string to an ArrayBuffer
    const key = await generateBrowserSpecificKey()
    const encryptedBuffer = new Uint8Array(
        encryptedData.match(/.{1,2}/g).map(byte => parseInt(byte, 16))
    ).buffer

    // Import the exported key
    const importedKey = await crypto.subtle.importKey(
        'raw', key, { name: 'AES-CBC', length: key.byteLength }, false, ['decrypt']
    )

    // Separate the IV (first 16 bytes) and the encrypted data
    const iv = new Uint8Array(encryptedBuffer.slice(0, 16))
    const encryptedDataBuffer = encryptedBuffer.slice(16)

    // Decrypt the data using AES-CBC
    const decryptedDataBuffer = await crypto.subtle.decrypt(
        { name: 'AES-CBC', iv }, importedKey, encryptedDataBuffer
    )

    // Convert the decrypted ArrayBuffer to a string
    const decoder = new TextDecoder()
    const decryptedData = decoder.decode(decryptedDataBuffer)

    return decryptedData
}
