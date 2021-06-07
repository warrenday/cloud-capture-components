import { EventEmitter } from './EventEmitter';

export type PresignedPostData = { url: string; fields: Record<string, any> };

export interface Events {
  progress: number;
  success: undefined;
  error: Error;
}

export class UploadService extends EventEmitter<Events> {
  xhr = new XMLHttpRequest();

  start({
    file,
    presignedPostData,
  }: {
    file: File;
    presignedPostData: PresignedPostData;
  }) {
    const formData = new FormData();
    for (const key in presignedPostData.fields) {
      const value = presignedPostData.fields[key];
      formData.append(key, value);
    }
    formData.append('file', file);

    this.xhr.upload.addEventListener('progress', event => {
      const progress = Math.ceil((event.loaded / event.total) * 100);
      this.emit('progress', progress);
    });

    this.xhr.addEventListener('readystatechange', () => {
      if (this.xhr.readyState === XMLHttpRequest.DONE) {
        const status = this.xhr.status;
        if (status === 0 || (status >= 200 && status < 400)) {
          this.emit('success', undefined);
        } else {
          this.emit('error', new Error(this.xhr.statusText));
        }
      }
    });

    this.xhr.open('POST', presignedPostData.url);
    this.xhr.send(formData);
  }
}
