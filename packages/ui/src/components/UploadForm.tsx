import { useState, useContext } from "preact/hooks";
import "./UploadForm.css";
import { UploadContext } from "../context/UploadContext";

export function UploadForm() {
  const { uploading, status, uploadFile } = useContext(UploadContext);

  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (file: File) => {
    if (uploading) return;

    const formData = new FormData();
    formData.append("file", file);

    await uploadFile(file); // pasa el path aquí
  };

  const handleFormSubmit = (e: Event) => {
    e.preventDefault();
    const input = (e.target as HTMLFormElement).elements.namedItem(
      "file"
    ) as HTMLInputElement;
    if (input?.files?.[0]) handleUpload(input.files[0]);
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer?.files?.[0]) handleUpload(e.dataTransfer.files[0]);
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  return (
    <div
      class={`upload-dropzone ${dragActive ? "drag-active" : ""}`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <form onSubmit={handleFormSubmit} class="upload-form">
        <input type="file" name="file" required disabled={uploading} />
        <button type="submit" disabled={uploading}>
          {uploading ? "Uploading..." : "Upload"}
        </button>
        {status && <p>{status}</p>}
      </form>
      <p class="upload-hint">
        Drag & drop a file here
      </p>
    </div>
  );
}
