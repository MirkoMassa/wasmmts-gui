// @ts-ignore
const indexedDB = window.indexedDB || 
    // @ts-ignore
    window.mozIndexedDB || 
    // @ts-ignore
    window.webkitIndexedDB ||
    // @ts-ignore
    window.msIndexedDB ||
    // @ts-ignore
    window.shimIndexedDB;

const request = indexedDB.open('wasmfiles', 1);

request.onerror = (e) =>{
    console.error(`database request error: ${e}`);
}

request.onsuccess = (e) =>{
    const db = request.result;

    db.onerror = (e) =>{
        console.error('Error creating/accessing db.');
    }

    db.createObjectStore('files');
};

// xml http req

const xhr = new XMLHttpRequest();
let blob:Blob;

xhr.open('GET', '')
