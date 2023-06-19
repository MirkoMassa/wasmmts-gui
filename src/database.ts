// file param handles a db store, filename param (key) handles a load 
export async function dbReqRes(fileOrKey:File | string):Promise<Blob | void>{
    // @ts-ignore
    const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB;
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
        db.onerror = (e) => {
            // @ts-ignore
            console.error('Error creating/accessing db.', e.target.result);
        }
        const transaction = db.transaction(['files'], "readwrite");
        const objStore = transaction.objectStore('files');
        if(fileOrKey instanceof File){
            storeObj(db, objStore, transaction, fileOrKey);
        } else if (typeof fileOrKey == 'string'){
            return loadObj(db, objStore, transaction, fileOrKey);
        }
        
    }     
}

export function storeObj(db:IDBDatabase, 
    objStore:IDBObjectStore,
    transaction:IDBTransaction,
    file:File):void {
    const key = file.name;
    const blobToStore = new Blob([file], {type: file.type});
    // console.log(blobToStore, key);
    
    const request = objStore.add(blobToStore, key);

    request.onerror = (e) => {
        // @ts-ignore
        console.error('Error while storing blob.', e.target.error);
    };
    request.onsuccess = (e) => {
        // @ts-ignore
        console.log('Blob stored', e.target.result);
    };

    transaction.oncomplete = () => {
        console.log('Storing transaction completed.');
        db.close();
    }
};
export async function removeObj(key:string):Promise<void> {
    try {
        const [dbRequest, db] = await dbAccess()!;
        const transaction = db.transaction(['files'], 'readwrite');
        const objStore = transaction.objectStore('files');
        const request = objStore.delete(key);
    request.onerror = (e) => {
        // @ts-ignore
        console.error('Error while removing blob.', e.target.error);
    };
    request.onsuccess = (e) => {
        // @ts-ignore
        console.log('Blob removed', key);
    };

    transaction.oncomplete = () => {
        console.log('Remove transaction completed.');
        db.close();
    }

    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
};

export function loadObj(db:IDBDatabase, 
    objStore:IDBObjectStore,
    transaction:IDBTransaction,
    key:string):Promise<Blob | null> {
    
    return new Promise((res, reject) =>{
        const request = objStore.get(key);
        request.onerror = (e) => {
            // @ts-ignore
            console.error('Error while retrieving blob.', e.target.result);
            // @ts-ignore
            reject(e.target.result)
        }
        request.onsuccess = (e) => {
            // @ts-ignore
            const resBlob:Blob = e.target.result;
            if(resBlob){
                console.log(resBlob);
                res(resBlob);
            } else {
                console.log('File not found.');
                res(null);
            }
            transaction.oncomplete = () => {
                console.log("Loading transaction completed");
                db.close();
            };
        }
    })
}

export async function loadAllObj(): Promise<[string[], Blob[]]> {
    try {
        const [request, db] = await dbAccess()!;

        return new Promise((resolve, reject) => {

        const transaction = db.transaction(['files'], 'readonly');
        const objStore = transaction.objectStore('files');
        let resKeys:string[], resBlobs:Blob[];

        objStore.getAllKeys().onsuccess = (e) => {
            // @ts-ignore
            resKeys = e.target.result;
            transaction.oncomplete = () => {
                console.log('loadingAllKeys transaction completed.');
            };
        }

        objStore.getAll().onsuccess = (e) => {
            // @ts-ignore
            resBlobs = e.target.result;
            transaction.oncomplete = () => {
                console.log('loadingAll transaction completed.');
                db.close();
                // console.log(resKeys, resBlobs)
                resolve([resKeys, resBlobs]);
            };
        };

        request.onerror = (event) => {
            // @ts-ignore
            console.error('Error creating/accessing db.', event.target.error);
            // @ts-ignore
            reject(event.target.error);
        };
        });
    } catch (err) {
        console.error('Error:', err);
        throw err;
    }
}


// normal db access for every operation
function dbAccess(): Promise<[IDBOpenDBRequest, IDBDatabase]> {
    
    return new Promise ((res, reject) => {
        // @ts-ignore
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB ||window.msIndexedDB || window.shimIndexedDB;
        
        const request = indexedDB.open('wasmfiles', 2);
        request.onerror = (e) =>{
            console.error(`database request error: ${e}`);
        }
        request.onupgradeneeded = (e) => {
            // @ts-ignore
            const db:IDBDatabase = e.target.result;
            if (!db.objectStoreNames.contains('files')) {
                db.createObjectStore('files');
            }
            
        }
        request.onsuccess = (e) => {
            // @ts-ignore
            const db:IDBDatabase = e.target.result;
            res([request, db]);
        }
    });
}