import { useState, useEffect } from 'react';
import { storage, firestore, timestamp } from './Firebase';

const useStorage = (file) => {
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [url, setUrl] = useState(null);

  useEffect(() => {
    // references
    const storageRef = storage.ref();
    const audioRef = storageRef.child('audio');
    const fileRef = audioRef.child(file.f.name);
    const collectionRef = firestore.collection('audio');

    if (file.f.name.length > 0) {
      fileRef.put(file.f).on(
        'state_change',
        (snap) => {
          let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
          setProgress(percentage);
        },
        (err) => {
          setError(err);
        },
        async () => {
          const url = await fileRef.getDownloadURL();
          const createdAt = timestamp();
          const name = file.dbName.length > 0 ? file.dbName : file.f.name;
          collectionRef.add({ url, createdAt, name, type: file.dbType });
          setUrl(url);
        }
      );
    }
  }, [file]);

  return { progress, url, error };
};

export default useStorage;
