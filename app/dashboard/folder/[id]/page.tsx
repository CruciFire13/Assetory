import AssetGrid from "@/components/AssetGrid";
import PopupUploader from "@/components/PopupUploader";
import { Sidebar } from "@/components//Sidebar";
import { Navbar } from "@/components//Navbar";
interface FolderPageProps {
  params: {
    id: string;
  };
}

export default function FolderPage({ params }: FolderPageProps) {
  const folderId = params.id;

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Navbar />

        <main className="p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Folder Contents</h1>
            <PopupUploader defaultParentId={folderId} />
          </div>

          <AssetGrid endpoint={`/api/folders/contents/${folderId}`} />
        </main>
      </div>
    </div>
  );
}
