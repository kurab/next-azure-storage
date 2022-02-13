import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useItem } from '../hooks/useItem';
import { v4 as uuidv4 } from 'uuid';

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm();
  const {
    getItems,
    registerItem,
    uploadFileToBlob,
    getBlobs,
    items,
    message,
    loading,
    blobs,
  } = useItem();

  useEffect(() => {
    getItems();
    getBlobs();
  }, [getItems, getBlobs]);

  const onClickSave = (formData: any) => {
    if (formData.files[0]) {
      const newFileName =
        uuidv4() + '.' + formData.files[0].name.split('.').pop();
      uploadFileToBlob(formData.files[0], newFileName);
      registerItem(newFileName);
    }
  };

  return (
    <>
      <h2>Upload</h2>
      <form onSubmit={handleSubmit(onClickSave)}>
        <input type="file" {...register('files', { required: true })} />
        <button type="submit">Save!</button>
      </form>
      {message && <div>{message}</div>}
      <h2>Medias</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {items &&
            items.map((item) => {
              return (
                <li key={item.id}>
                  {item.name} - {item.createdAt}
                </li>
              );
            })}
        </ul>
      )}
      <h2>Blobs in Container</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <ul>
          {blobs &&
            blobs.map((blob, key) => {
              return <li key={key}>{blob}</li>;
            })}
        </ul>
      )}
    </>
  );
};

export default Home;
