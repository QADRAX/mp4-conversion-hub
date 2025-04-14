import { useState } from "preact/hooks";
import { FolderNavigator } from "./FolderNavigator";
import { UploadForm } from "./UploadForm";
import { PageContainer } from "./layout/PageContainer";

export function UploadPage(_: { path?: string }) {
  const [selectedPath, setSelectedPath] = useState("");

  return (
    <PageContainer>
      <FolderNavigator onSelect={(path) => setSelectedPath(path)} />
      <hr style={{ margin: "2rem 0" }} />
      <UploadForm targetPath={selectedPath} />
    </PageContainer>
  );
}
