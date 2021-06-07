import cuid from 'cuid';
import { useEffect, useState } from 'react';
import { PresignedPostData, UploadService } from '../services/UploadService';

export type UploadStatus = 'in_progress' | 'success' | 'error';
export type RequestUpload = (
  imageName: string
) => Promise<{
  imageName: string;
  sourceName: string;
  presignedPostData: PresignedPostData;
}>;
export interface Upload<E> {
  id: string;
  status: UploadStatus;
  progress: number;
  imageName?: string;
  sourceName?: string;
  error?: Error;
  entry: E;
}

export interface FinishedUpload {
  error: Error | null;
  url: string;
  file: File;
}

interface UseUploadSettings {
  onRequestUpload: RequestUpload;
  onUploadStart: () => void;
  onUploadEnd: (entries: FinishedUpload[]) => void;
}

type UseUploadReturn<E> = [
  (entries: E[]) => void,
  {
    uploads: Upload<E>[];
    progress: number;
  }
];

const getTotalProgress = (uploadEntries: Upload<{}>[]) => {
  if (!uploadEntries.length) {
    return 0;
  }

  const totalProgress = uploadEntries.reduce(
    (acc, entry) => acc + entry.progress,
    0
  );

  return Math.ceil(totalProgress / uploadEntries.length);
};

const createFinishedUpload = (
  uploadEntry: Upload<{ file: File }>,
  error?: Error
): FinishedUpload => {
  const { entry, imageName, sourceName } = uploadEntry;
  return {
    url: `https://cdn.cloudcapture.io/${sourceName}/${imageName}`,
    file: entry.file,
    error: error || null,
  };
};

export const useUpload = <E extends { name: string; file: File }>(
  settings: UseUploadSettings
): UseUploadReturn<E> => {
  const [uploadEntries, setUploadEntries] = useState<Upload<E>[]>([]);
  const { onRequestUpload, onUploadEnd } = settings;
  const [, setUploaders] = useState<UploadService[]>([]);

  // Cleanup event listeners
  useEffect(() => {
    return () => {
      setUploaders(uploaders => {
        uploaders.forEach(uploader => uploader.removeAll());
        return [];
      });
    };
  }, [setUploaders]);

  // Handle onUploadEnd event when all active uploads have finished
  useEffect(() => {
    const isAllFinished = uploadEntries.every(
      entry => entry.status !== 'in_progress'
    );
    if (isAllFinished && uploadEntries.length > 0) {
      const finishedUploads = uploadEntries.map(uploadEntry =>
        createFinishedUpload(uploadEntry)
      );
      onUploadEnd(finishedUploads);
    }
  }, [uploadEntries]);

  const updateUploadEntry = (id: string, update: Partial<Upload<E>>) => {
    return setUploadEntries(uploadEntries => {
      return uploadEntries.map(uploadEntry => {
        if (uploadEntry.id === id) {
          return {
            ...uploadEntry,
            ...update,
          };
        }
        return uploadEntry;
      });
    });
  };

  const upload = (entries: E[]) => {
    const newUploadEntries: Upload<E>[] = entries.map(entry => ({
      id: cuid(),
      status: 'in_progress',
      progress: 0,
      entry,
    }));
    setUploadEntries(uploadEntries => newUploadEntries.concat(uploadEntries));

    for (let uploadEntry of newUploadEntries) {
      const uploader = new UploadService();

      uploader.on('progress', progress => {
        updateUploadEntry(uploadEntry.id, { progress });
      });
      uploader.on('success', () => {
        updateUploadEntry(uploadEntry.id, { status: 'success' });
      });
      uploader.on('error', error => {
        updateUploadEntry(uploadEntry.id, { status: 'error', error });
      });

      onRequestUpload(uploadEntry.entry.name)
        .then(({ imageName, sourceName, presignedPostData }) => {
          updateUploadEntry(uploadEntry.id, { imageName, sourceName });

          uploader.start({
            file: uploadEntry.entry.file,
            presignedPostData,
          });
        })
        .catch(() => {
          updateUploadEntry(uploadEntry.id, { status: 'error' });
        });

      // Store uploaders in state so we can remove event listeners
      setUploaders(uploaders => uploaders.concat(uploader));
    }
  };

  const totalProgress = getTotalProgress(uploadEntries);

  return [
    upload,
    {
      uploads: uploadEntries,
      progress: totalProgress,
    },
  ];
};
