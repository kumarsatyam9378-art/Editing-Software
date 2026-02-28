import { useRef } from 'react';

export default function MediaLibrary({ onFileUpload }) {
  const inputRef = useRef(null);

  return (
    <section className="panel">
      <h3>Media Library</h3>
      <button type="button" onClick={() => inputRef.current?.click()}>
        Upload Video / Audio / Image
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="video/*,audio/*,image/*"
        hidden
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) {
            onFileUpload(file);
          }
        }}
      />
    </section>
  );
}
