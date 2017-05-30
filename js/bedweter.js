'use strict'

import bl from 'bl';
import concat from 'concat-stream';
import { Buffer } from 'safe-buffer';
import Readable from 'readable-stream';

import IPFS from 'ipfs';

const node = new IPFS({
    repo: "ilogos", //String(Math.random() + Date.now())
    start: true,
    init: true,
    EXPERIMENTAL: { // enable experimental features
        pubsub: true
    },
    config: {
        "Addresses": {
            "Swarm": ["/ip4/127.0.0.1/tcp/4001",
                      "/ip4/0.0.0.0/tcp/4001",
                      "/libp2p-webrtc-star/dns4/star-signal.cloud.ipfs.team/wss"],
            "API": "",
            "Gateway": ""
        },
        "Discovery": {
            "MDNS": {
                "Enabled": true,
                "Interval": 10
            },
            "webRTCStar": {
                "Enabled": true
            }
        },
        "Bootstrap": [
            "/dns4/ams-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLer265NRgSp2LA3dPaeykiS1J6DifTC88f5uVQKNAd",
            "/dns4/sfo-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLju6m7xTh3DuokvT3886QRYqxAzb1kShaanJgW36yx",
            "/dns4/lon-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLMeWqB7YGVLJN3pNLQpmmEk35v6wYtsMGLzSr5QBU3",
            "/dns4/sfo-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLnSGccFuZQJzRadHn95W2CrSFmZuTdDWP8HXaHca9z",
            "/dns4/sfo-3.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLPppuBtQSGwKDZT2M73ULpjvfd3aZ6ha4oFGL1KrGM",
            "/dns4/sgp-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLSafTMBsPKadTEgaXctDQVcqN88CNLHXMkTNwMKPnu",
            "/dns4/nyc-1.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLueR4xBeUbY9WZ9xGUUxunbKWcrNFTDAadQJmocnWm",
            "/dns4/nyc-2.bootstrap.libp2p.io/tcp/443/wss/ipfs/QmSoLV4Bbm51jM9C4gDYZQ9Cy3U6aXMJDAbzgu2fzaDs64"
            ]
    }

});

node.on('ready', () => {
    console.log('IPFS node is ready')
    console.log(node.config.get().then(function (result) {
        console.log(result.Addresses);
        console.log(result.Bootstrap);
    }));
});


function createData (){
    var kamers = {};
    kamers.bed = {};
    kamers.bed.prive = true;
    kamers.bed.locatie = "hc.2.35";
    kamers.bed.beschikbaar = true;
    kamers.bed.type = "foobar";
    var json_kamer = JSON.stringify(kamers);
    const buffered = new Buffer(json_kamer);
    const rs = new Readable();
    rs.push(buffered);
    rs.push(null);
    const filePair = {
            path: 'data.txt',
            content: rs};
    return buffered;
};

console.log(createData());

function store () {
    var toStore = document.getElementById('source').value
    // var toStore = createData()

    node.files.add(Buffer.from(toStore), (err, res) => {
        if (err || !res) {
            return console.error('ipfs add error', err, res)
        };

        res.forEach((file) => {
            if (file && file.hash) {
                document.getElementById('hash').innerText = file.hash;
                console.log('successfully stored', file.hash);
        //        display(file.hash);
            }
        })
    })
};

function findFile(){
        var fileHash = document.getElementById('foobar').value
//        console.log("Filehash is:", fileHash);
//        node.files.get(fileHash, function (err, stream) {
//                    stream.on('end', console.log('ellende'))
//            stream.pipe(bl((err, data) => {
//                console.log(data.toString())
//                    }));
//                stream.on('data', (file) => {
//                 // write the file's path and contents to standard out;
//                 console.log(file.path);
//                 file.content.pipe(process.stdout);
//         })
//})
        display(fileHash);
};

function display (hash) {
    // buffer: true results in the returned result being a buffer rather than a stream
    node.files.cat(hash, (err, res) => {
        if (err || !res) {
            return console.error('ipfs cat error', err, res);
        };

        document.getElementById('hash').innerText = hash;

        res.pipe(concat((data) => {
            document.getElementById('content').innerText = data;
        }))
    })
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('store').onclick = store;
});

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('read').onclick = findFile;
});
