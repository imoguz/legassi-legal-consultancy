'use client';
import React, { useState } from 'react';
import { Upload, message } from 'antd';
import ImgCrop from 'antd-img-crop';

export default function ImageUploadWithCrop({ value, onChange, maxCount = 1 }) {
  const [fileList, setFileList] = useState(
    value
      ? [
          {
            uid: '-1',
            name: 'profile-image',
            status: 'done',
            url: value,
          },
        ]
      : []
  );

  const handleChange = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);

    if (file.originFileObj) {
      onChange?.(file.originFileObj);
    } else if (newFileList.length === 0) {
      onChange?.(null);
    }
  };

  const handlePreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  return (
    <ImgCrop
      rotationSlider
      modalTitle="Edit Image"
      modalOk="Crop"
      modalCancel="Cancel"
      beforeCrop={(file) => {
        const isImage = file.type.startsWith('image/');
        if (!isImage) message.error('Please select an image file');
        return isImage;
      }}
    >
      <Upload
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        maxCount={maxCount}
        className="hide-tooltips"
      >
        {fileList.length < maxCount && '+ Upload'}
      </Upload>
    </ImgCrop>
  );
}
