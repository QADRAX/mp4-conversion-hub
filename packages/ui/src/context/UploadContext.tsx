import { createContext } from "preact";
import { useState } from "preact/hooks";

export type UploadState = {
  uploading: boolean;
  status: string | null;
  uploadFile: (file: File, targetPath: string) => Promise<void>;
};

export const UploadContext = createContext<UploadState>({
  uploading: false,
  status: null,
  uploadFile: async () => {},
});

export function UploadProvider({
  children,
}: {
  children: preact.ComponentChildren;
}) {
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const uploadFile = async (file: File, targetPath: string): Promise<void> => {
    if (uploading) {
      setStatus("⚠️ Please wait until the current upload finishes.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setStatus("Uploading...");

    try {
      const res = await fetch(
        `/api/upload?path=${encodeURIComponent(targetPath)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setStatus(`✅ Uploaded: ${data.file}`);
    } catch (err) {
      console.error(err);
      setStatus("❌ Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <UploadContext.Provider value={{ uploading, status, uploadFile }}>
      {children}
    </UploadContext.Provider>
  );
}
