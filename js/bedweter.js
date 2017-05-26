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
});

node.on('ready', () => {
    console.log('IPFS node is ready')
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
    //var toStore = document.getElementById('source').value
    var toStore = createData()

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
