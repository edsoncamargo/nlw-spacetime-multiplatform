"use client";

import { ChangeEvent, Fragment, useState } from "react";

export function MediaPicker() {
  const [preview, setPreview] = useState<string | null>(null);

  function onMediaSelected(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.target;

    if (!files) {
      return;
    }

    const previewUrl = URL.createObjectURL(files[0]);
    setPreview(previewUrl);
  }

  return (
    <Fragment>
      <input
        onChange={onMediaSelected}
        id="media"
        type="file"
        accept="image/*"
        name="coverUrl"
        className="invisible h-0 w-0"
      />

      {preview && (
        // eslint-disable-next-line
        <img
          src={preview}
          alt=""
          className="objetc-cover aspect-video w-full rounded-lg"
        />
      )}
    </Fragment>
  );
}
