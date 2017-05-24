'use strict';

var openpgp = require('openpgp');

openpgp.initWorker({ path:'openpgp.worker.js' })           // set the relative web worker path

openpgp.config.aead_protect = true                         // activate fast AES-GCM mode (not yet OpenPGP standard)


var keyring = new openpgp.Keyring();

var user = 'whiteout.test@t-online.de',
    passphrase = 'asdf',
    keySize = 512,
    keyId = 'f6f60e9b42cdff4c',
    keyFingerP = '5856cef789c3a307e8a1b976f6f60e9b42cdff4c';


var pubkey = `-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: OpenPGP.js v.1.20131011
Comment: http://openpgpjs.org

xk0EUlhMvAEB/2MZtCUOAYvyLFjDp3OBMGn3Ev8FwjzyPbIF0JUw+L7y2XR5
RVGvbK88unV3cU/1tOYdNsXI6pSp/Ztjyv7vbBUAEQEAAc0pV2hpdGVvdXQg
VXNlciA8d2hpdGVvdXQudGVzdEB0LW9ubGluZS5kZT7CXAQQAQgAEAUCUlhM
vQkQ9vYOm0LN/0wAAAW4Af9C+kYW1AvNWmivdtr0M0iYCUjM9DNOQH1fcvXq
IiN602mWrkd8jcEzLsW5IUNzVPLhrFIuKyBDTpLnC07Loce1
=6XMW
-----END PGP PUBLIC KEY BLOCK-----`


var privkey = `-----BEGIN PGP PRIVATE KEY BLOCK-----
Version: OpenPGP.js v.1.20131011
Comment: http://openpgpjs.org

xcBeBFJYTLwBAf9jGbQlDgGL8ixYw6dzgTBp9xL/BcI88j2yBdCVMPi+8tl0
eUVRr2yvPLp1d3FP9bTmHTbFyOqUqf2bY8r+72wVABEBAAH+AwMIhNB4ivtv
Y2xg6VeMcjjHxZayESHACV+nQx5Tx6ev6xzIF1Qh72fNPDppLhFSFOuTTMsU
kTN4c+BVYt29spH+cA1jcDAxQ2ULrNAXo+hheOqhpedTs8aCbcLFkJAS16hk
YSk4OnJgp/z24rVju1SHRSFbgundPzmNgXeX9e8IkviGhhQ11Wc5YwVkx03t
Z3MdDMF0jyhopbPIoBdyJB0dhvBh98w3JmwpYh9wjUA9MBHD1tvHpRmSZ3BM
UCmATn2ZLWBRWiYqFbgDnL1GM80pV2hpdGVvdXQgVXNlciA8d2hpdGVvdXQu
dGVzdEB0LW9ubGluZS5kZT7CXAQQAQgAEAUCUlhMvQkQ9vYOm0LN/0wAAAW4
Af9C+kYW1AvNWmivdtr0M0iYCUjM9DNOQH1fcvXqIiN602mWrkd8jcEzLsW5
IUNzVPLhrFIuKyBDTpLnC07Loce1
=ULta
-----END PGP PRIVATE KEY BLOCK-----`

// clear any keys already in the keychain
keyring.clear();
keyring.store();
keyring.publicKeys.importKey(pubkey);
keyring.privateKeys.importKey(privkey);

console.log("keyring: ", keyring)

// it('getKeysForId() - unknown id', function() {
////var keys = keyring.getKeysForId('01234567890123456');

// it('getKeysForId() - valid id', function() {
////var keys = keyring.getKeysForId(keyId);
////console.log("keyring.getKeysForId(keyId): ", keys[0].primaryKey.getKeyId().toHex());

console.log("privkey: ", privkey)
var privKeyObj = openpgp.key.readArmored(privkey).keys[0];
console.log("privKeyObj: ", privKeyObj)

console.log("pubkey: ", pubkey)
var pubKeyObj = openpgp.key.readArmored(pubkey).keys[0];
console.log("pubKeyObj: ", pubKeyObj)

privKeyObj.decrypt(passphrase);
console.log("privKeyObj: ", privKeyObj);


var cleartext, cryptedtext, decryptedtext, detachedSig, validity;

var options = {
    data: 'Hello, World!',                                 // input as String (or Uint8Array)
    privateKeys: [privKeyObj]                              // for signing
};

openpgp.sign(options)
    .then(function(signed) {
        console.log("signed: ", signed);
        cleartext = signed.data })                         // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
    .then(function() {
        console.log("cleartext: ", cleartext) })
    .then(function() {
        options = {
            message: openpgp.cleartext.readArmored(cleartext),    // parse armored message
            publicKeys: openpgp.key.readArmored(pubkey).keys[0]   // for verification
        };

        openpgp.verify(options).
            then(function(verified) {
	        validity = verified.signatures[0].valid;   // true
	        if (validity) {
                    console.log('signed by key id: ', verified.signatures[0].keyid.toHex());
	        }
        })
    })

var options = {
    data: 'This is very, very secret!',                    // input as String (or Uint8Array)
    publicKeys: pubKeyObj                                  // for encryption
};

openpgp.encrypt(options)
    .then(function(encryptedData) {
        cryptedtext = encryptedData.data })                // '-----BEGIN PGP SIGNED MESSAGE ... END PGP SIGNATURE-----'
    .then(function() {
        console.log("cryptedtext: ", cryptedtext) })
    .then(function() {
        var options = {
            message: openpgp.message.readArmored(cryptedtext),
            privateKey: privKeyObj
        };
        openpgp.decrypt(options)
            .then(function(decryptedData) {
                decryptedtext = decryptedData.data })
            .then(function() {
                console.log("decryptedtext: ", decryptedtext) })
        });
