import React from 'react';
import { Meta, Story } from '@storybook/react';
import { Provider, UploadForm } from '../src';
import { IUploadProps } from '../src/components/UploadForm';

const meta: Meta = {
  title: 'Welcome',
  component: UploadForm,
  argTypes: {
    children: {
      control: {
        type: 'text',
      },
    },
    dropText: {
      control: {
        type: 'text',
      },
    },
  },
  parameters: {
    controls: { expanded: true },
  },
};

export default meta;

// TODO, need to set cors headers on s3 bucket, will need user guide for this too

const Template: Story<IUploadProps> = args => (
  <Provider>
    <UploadForm
      {...args}
      onRequestUpload={imageName => {
        return fetch(
          'http://localhost:3000/cloud/upload/sign?apiKey=7fe2b1da-c49d-47a7-9cd3-75b1b2abab7e',
          {
            method: 'POST',
            body: JSON.stringify({
              imageName,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
          .then(res => res.json())
          .then(res => {
            return res;
          });
      }}
      onUploadStart={() => {
        console.log('start');
      }}
      onUploadEnd={data => {
        console.log('end', data);
      }}
    />
  </Provider>
);

export const Default = Template.bind({});

Default.parameters = {
  backgrounds: {
    default: 'blue',
    values: [
      {
        name: 'blue',
        value: '#e9f3fe',
      },
      {
        name: 'white',
        value: '#fff',
      },
    ],
  },
};

Default.args = {};
