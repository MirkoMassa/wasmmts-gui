// @ts-ignore
export function addFileToDB(file:File):void{
    
    const indexedDB = window.indexedDB || 
    // @ts-ignore
    window.mozIndexedDB || 
    // @ts-ignore
    window.webkitIndexedDB ||
    // @ts-ignore
    window.msIndexedDB ||
    // @ts-ignore
    window.shimIndexedDB;
    const request = indexedDB.open('wasmfiles', 2);

    request.onerror = (e) =>{
        console.error(`database request error: ${e}`);
    }
    request.onupgradeneeded = (e) =>{
        // @ts-ignore
        const db = e.target.result;
        if (!db.objectStoreNames.contains('files')) {
            db.createObjectStore('files');
        }
    }
    request.onsuccess = (e) => {
        // @ts-ignore
        const db:IDBDatabase = e.target.result;
        // Create an object store (if it doesn't exist)
        
        db.onerror = (e) => {
            // @ts-ignore
            console.error('Error creating/accessing db.', e.target.result);
        }
        const transaction = db.transaction(['files'], "readwrite");
        const objStore = transaction.objectStore('files');
        loadObj(db, objStore, transaction, file);
    }     
}

export function loadObj(db:IDBDatabase, 
    objStore:IDBObjectStore,
    transaction:IDBTransaction,
    file:File) {
    const key = file.name;
    const blobToStore = new Blob([file], {type: 'application/wasm'});
    console.log(blobToStore, key);
    const request = objStore.add(blobToStore, key);

    request.onerror = (e) => {
        // @ts-ignore
        console.error('error', e.target.result);
    };
    request.onsuccess = (e) => {
        // @ts-ignore
        console.log('Blob stored', e.target.result);
    };

    transaction.oncomplete = () => {
        console.log('Transaction completed.');
        db.close();
    }
};
