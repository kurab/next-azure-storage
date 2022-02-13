import type { NextPage } from 'next';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useItem } from '../hooks/useItem';

const Home: NextPage = () => {
  const { register, handleSubmit } = useForm();
  const { getItems, registerItem, items, message, loading } = useItem();

  useEffect(() => {
    getItems();
  }, [getItems]);

  const onClickSave = (formData: any) => {
    if (formData.files[0]) {
      registerItem(formData.files[0].name);
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
    </>
  );
};

export default Home;
