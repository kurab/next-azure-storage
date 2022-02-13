import axios from 'axios';
import { useCallback, useState } from 'react';
import { ItemType } from '../types/ItemType';
import { BlobServiceClient, ContainerClient } from '@azure/storage-blob';

const containerName = 'sample-container';
const sasToken = process.env.NEXT_PUBLIC_STORAGESASTOKEN;
const storageAccountName = process.env.NEXT_PUBLIC_STORAGERESOURCENAME;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const useItem = () => {
  const [items, setItems] = useState<Array<ItemType>>([]);
  const [message, setMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [blobs, setBlobs] = useState<Array<string>>([]);

  const getBlobsInContainer = async (containerClient: ContainerClient) => {
    const returnedBlobUrls: string[] = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      returnedBlobUrls.push(
        `https://${storageAccountName}.blob.core.windows.net/${containerName}/${blob.name}`
      );
    }

    return returnedBlobUrls;
  };

  const uploadFileToBlob = useCallback(
    async (file: File | null, newFileName: string) => {
      setLoading(true);
      if (!file) {
        setMessage('No FILE');
      } else {
        const blobService = new BlobServiceClient(
          `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
        );

        const containerClient: ContainerClient =
          blobService.getContainerClient(containerName);
        await containerClient.createIfNotExists({
          access: 'container',
        });

        const blobClient = containerClient.getBlockBlobClient(newFileName);
        const options = { blobHTTPHeaders: { blobContentType: file.type } };

        await blobClient.uploadData(file, options);

        const blobs = await getBlobsInContainer(containerClient);
        setBlobs(blobs);
        setMessage('uploaded');
      }
      setLoading(false);
    },
    []
  );

  const getBlobs = useCallback(async () => {
    setLoading(true);
    const blobService = new BlobServiceClient(
      `https://${storageAccountName}.blob.core.windows.net/?${sasToken}`
    );

    const containerClient: ContainerClient =
      blobService.getContainerClient(containerName);

    const blobs = await getBlobsInContainer(containerClient);
    setBlobs(blobs);
    setLoading(false);
  }, []);

  const getItems = useCallback(async () => {
    setLoading(true);
    await axios
      .get('/api/items')
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
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
        setMessage('registered!');
      })
      .catch((err) => {
        setMessage(`failed: ${err}`);
      });
    setLoading(false);
  }, []);

  return {
    getItems,
    registerItem,
    uploadFileToBlob,
    getBlobs,
    items,
    message,
    loading,
    blobs,
  };
};
