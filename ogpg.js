var openpgp = require('openpgp'); // use as CommonJS, AMD, ES6 module or via window.openpgp

openpgp.initWorker({ path:'./lib/openpgp.worker.js' }) // set the relative web worker path

openpgp.config.aead_protect = true // activate fast AES-GCM mode (not yet OpenPGP standard)

// Generate new key pair

var options = {
    userIds: [{ name:'Ad Thiers', email:'ad@datacomputing.nl' }], // multiple user IDs
    numBits: 4096,                                                // RSA key size
    passphrase: 'een heel geheim wachtwoord'                      // protects the private key
};

console.log("====== Generating new key pair ======");
var keyPair = {};

openpgp.generateKey(options).then(function(key) {
    keyPair = key;
    console.log("====== Key pair generated ======");
});

const poll = () => {
    console.log("Private key: " + keyPair.privateKeyArmored);    // '-----BEGIN PGP PRIVATE KEY BLOCK ... '
    console.log("Public key:  " + keyPair.publicKeyArmored);     // '-----BEGIN PGP PUBLIC KEY BLOCK ... '
}

setInterval(poll, 2000)

