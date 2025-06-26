// app/dashboard/folder/[id]/page.tsx
import { use } from "react";
import FolderPageClient from "@/components/FolderPageClient";

interface FolderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function FolderPage({ params }: FolderPageProps) {
  const { id } = use(params); // unwraps the async `params`

  return <FolderPageClient folderId={id} />;
}