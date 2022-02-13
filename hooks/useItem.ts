import axios from 'axios';
import { useCallback, useState } from 'react';
import { ItemType } from '../types/ItemType';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const useItem = () => {
  const [items, setItems] = useState<Array<ItemType>>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getItems = useCallback(async () => {
    setLoading(true);
    await axios
      .get('/api/items')
      .then((res) => {
        console.log(res);
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err);
        setMessage(`failed: ${err}`);
      });
    setLoading(false);
  }, []);

  const registerItem = useCallback(async (name: string) => {
    setLoading(true);
    const requestData = {
      name: name,
    };
    await axios
      .post('/api/register', requestData, { headers })
      .then((res) => {
        console.log(res);
        setMessage('registered!');
      })
      .catch((err) => {
        console.log(err);
        setMessage(`failed: ${err}`);
      });
    setLoading(false);
  }, []);
  return { getItems, registerItem, items, message, loading };
};
