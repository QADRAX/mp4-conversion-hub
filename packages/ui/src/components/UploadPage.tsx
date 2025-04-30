import { UploadForm } from "./UploadForm";
import { PageContainer } from "./layout/PageContainer";

export function UploadPage(_: { path?: string }) {

  return (
    <PageContainer>
      <h2>Upload files</h2>
      <hr style={{ margin: "2rem 0" }} />
      <UploadForm />
    </PageContainer>
  );
}
