import { useEffect, useState } from "preact/hooks";
import './FolderNavigator.css';

type FolderApiResponse = {
  path: string;
  folders: string[];
};

export function FolderNavigator({
  onSelect,
}: {
  onSelect: (fullPath: string) => void;
}) {
  const [currentPath, setCurrentPath] = useState<string>("");
  const [folders, setFolders] = useState<string[]>([]);
  const [pathStack, setPathStack] = useState<string[]>([]);

  useEffect(() => {
    fetch(`/api/folders?path=${encodeURIComponent(currentPath)}`)
      .then((res) => res.json())
      .then((data: FolderApiResponse) => {
        setFolders(data.folders);
      })
      .catch((err) => {
        console.error("Error loading folders:", err);
        setFolders([]);
      });
  }, [currentPath]);

  const goTo = (folder: string) => {
    const newPath = pathStack.concat(folder);
    setPathStack(newPath);
    setCurrentPath(newPath.join("/"));
    onSelect(newPath.join("/"));
  };

  const goBack = () => {
    const newPath = pathStack.slice(0, -1);
    setPathStack(newPath);
    setCurrentPath(newPath.join("/"));
    onSelect(newPath.join("/"));
  };

  return (
    <div class="folder-navigator">
      <div class="path-display">
        📁 /{pathStack.join("/")}
        {pathStack.length > 0 && (
          <button onClick={goBack} class="back-button">
            ⬅ Back
          </button>
        )}
      </div>
      <ul class="folder-list">
        {folders.map((folder) => (
          <li key={folder} onClick={() => goTo(folder)} class="folder-item">
            {folder}
          </li>
        ))}
      </ul>
    </div>
  );
}
