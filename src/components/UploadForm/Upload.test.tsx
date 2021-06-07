import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import xhrMock, { delay } from 'xhr-mock';
import { UploadForm } from '../../index';

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

describe('Upload', () => {
  beforeEach(() => {
    xhrMock.setup();

    global.URL.createObjectURL = jest
      .fn()
      .mockReturnValue('https://cloudcapture.io/imagepath');
  });

  afterEach(() => {
    xhrMock.teardown();
  });

  it('shows a failure when the request for an upload fails', async () => {
    const { getByLabelText, findByText, getByText } = render(
      <UploadForm
        dropText="drop images here"
        onRequestUpload={async () => {
          await wait(100);
          throw new Error(`Can't upload`);
        }}
        onUploadStart={() => {}}
        onUploadEnd={() => {}}
      />
    );

    fireEvent.change(getByLabelText(/drop images here/i), {
      target: {
        files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
      },
    });

    await findByText('Failed');

    expect(getByText('chucknorris.png')).toBeVisible();
    expect(getByText('Failed')).toBeVisible();
  });

  it('shows a failure when the upload fails', async () => {
    xhrMock.post('/upload/url', {
      status: 400,
      reason: 'File too large',
    });

    const { getByLabelText, findByText, getByText } = render(
      <UploadForm
        dropText="drop images here"
        onRequestUpload={async () => {
          await wait(100);
          return {
            sourceName: '',
            imageName: '',
            presignedPostData: { url: '/upload/url', fields: {} },
          };
        }}
        onUploadStart={() => {}}
        onUploadEnd={() => {}}
      />
    );

    fireEvent.change(getByLabelText(/drop images here/i), {
      target: {
        files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
      },
    });

    await findByText('Failed');

    expect(getByText('chucknorris.png')).toBeVisible();
    expect(getByText('Failed')).toBeVisible();
  });

  it('shows the current upload percentage when upload is in progress', async () => {
    // TODO, progress events dont seem to fire with mock
    xhrMock.post('/upload/url', delay({ status: 200 }, 3000));

    const { getByLabelText, findByText, getByText } = render(
      <UploadForm
        dropText="drop images here"
        onRequestUpload={async () => {
          await wait(100);
          return {
            sourceName: '',
            imageName: '',
            presignedPostData: { url: '/upload/url', fields: {} },
          };
        }}
        onUploadStart={() => {}}
        onUploadEnd={() => {}}
      />
    );

    fireEvent.change(getByLabelText(/drop images here/i), {
      target: {
        files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
      },
    });

    await findByText('0%');

    expect(getByText('chucknorris.png')).toBeVisible();
    expect(getByText('0%')).toBeVisible();
  });

  it('shows a success status when upload completes', async () => {
    xhrMock.post('/upload/url', {
      status: 200,
    });

    const { getByLabelText, findByText, getByText } = render(
      <UploadForm
        dropText="drop images here"
        onRequestUpload={async () => {
          await wait(100);
          return {
            sourceName: '',
            imageName: '',
            presignedPostData: { url: '/upload/url', fields: {} },
          };
        }}
        onUploadStart={() => {}}
        onUploadEnd={() => {}}
      />
    );

    fireEvent.change(getByLabelText(/drop images here/i), {
      target: {
        files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
      },
    });

    await findByText('Complete');

    expect(getByText('chucknorris.png')).toBeVisible();
    expect(getByText('Complete')).toBeVisible();
  });

  it('allows addition of multiple files', async () => {
    xhrMock.post('/upload/url', {
      status: 200,
    });

    const { getByLabelText, findByText, getByText } = render(
      <UploadForm
        dropText="drop images here"
        onRequestUpload={async () => {
          await wait(100);
          return {
            sourceName: '',
            imageName: '',
            presignedPostData: { url: '/upload/url', fields: {} },
          };
        }}
        onUploadStart={() => {}}
        onUploadEnd={() => {}}
      />
    );

    fireEvent.change(getByLabelText(/drop images here/i), {
      target: {
        files: [new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' })],
      },
    });

    fireEvent.change(getByLabelText(/drop images here/i), {
      target: {
        files: [new File(['(⌐□_□)'], 'batman.jpg', { type: 'image/jpeg' })],
      },
    });

    await findByText('batman.jpg');

    expect(getByText('chucknorris.png')).toBeVisible();
    expect(getByText('batman.jpg')).toBeVisible();
  });

  it('outputs the cloudcapture url for complete uploads', async () => {
    const mockOnUploadEnd = jest.fn();

    xhrMock.post('/upload/url', {
      status: 200,
    });

    const { getByLabelText, findByText } = render(
      <UploadForm
        dropText="drop images here"
        onRequestUpload={async imageName => {
          await wait(100);
          return {
            sourceName: 'cloud',
            imageName,
            presignedPostData: { url: '/upload/url', fields: {} },
          };
        }}
        onUploadStart={() => {}}
        onUploadEnd={mockOnUploadEnd}
      />
    );

    fireEvent.change(getByLabelText(/drop images here/i), {
      target: {
        files: [
          new File(['(⌐□_□)'], 'chucknorris.png', { type: 'image/png' }),
          new File(['(⌐□_□)'], 'batman.jpg', { type: 'image/jpeg' }),
        ],
      },
    });

    await findByText('Complete');

    expect(mockOnUploadEnd).toHaveBeenCalledTimes(1);
    expect(mockOnUploadEnd).toHaveBeenCalledWith([
      {
        error: null,
        file: expect.any(File),
        url: 'https://cdn.cloudcapture.io/cloud/chucknorris.png',
      },
      {
        error: null,
        file: expect.any(File),
        url: 'https://cdn.cloudcapture.io/cloud/batman.jpg',
      },
    ]);
  });
});
