import { useSession } from "../features/auth/hooks/useSession";
import { CollectionShell } from "../features/collections/components/CollectionShell";
import { useCollections } from "../features/collections/hooks/useCollections";
import { CreateCollectionPage } from "../features/collections/pages/CreateCollectionPage";
import { CollectionSettingsPage } from "../features/collections/pages/CollectionSettingsPage";
import { LibraryPage } from "../features/collections/pages/LibraryPage";
import { UploadPage } from "../features/collections/pages/UploadPage";
import { WorkspacePage } from "../features/collections/pages/WorkspacePage";
import { useUploadDocument } from "../features/documents/hooks/useUploadDocument";
import { navigate, useAppRoute } from "./navigation";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";

function ProductLoading() {
  return <div className="min-h-screen bg-[var(--canvas)] p-6"><div className="mx-auto h-12 max-w-[1400px] animate-pulse bg-[var(--paper)]" /><div className="mx-auto mt-12 h-36 max-w-[1400px] animate-pulse bg-[var(--paper)]" /></div>;
}

function ProductApp() {
  const route = useAppRoute() ?? { name: "library" as const };
  const collectionState = useCollections();
  const documentUpload = useUploadDocument();
  const collections = collectionState.collections;
  const activeCollection = "collectionId" in route ? collections.find((collection) => collection.id === route.collectionId) : undefined;

  if (collectionState.isLoading) return <ProductLoading />;
  if (collectionState.error) return <div className="grid min-h-screen place-items-center bg-[var(--canvas)] p-6 text-center"><div><p className="text-[13px] text-[#8f3d42]">We couldn’t load your library.</p><button type="button" onClick={() => collectionState.refetch()} className="mt-3 text-[12px] text-[var(--purple)]">Try again</button></div></div>;

  const create = async (name: string) => {
    const collection = await collectionState.create.mutateAsync(name);
    navigate({ name: "upload", collectionId: collection.id });
  };
  const addDocument = async (collectionId: string, file: File) => {
    await documentUpload.mutateAsync({ collectionId, file });
  };
  const rename = async (collectionId: string, name: string) => { await collectionState.rename.mutateAsync({ collectionId, name }); };
  const removeDocument = async (collectionId: string, documentId: string) => {
    const document = collections.find((collection) => collection.id === collectionId)?.documents.find((item) => item.id === documentId);
    if (document) await collectionState.removeDocument.mutateAsync(document);
  };
  const deleteCollection = async (collectionId: string) => {
    const collection = collections.find((item) => item.id === collectionId);
    if (collection) await collectionState.delete.mutateAsync(collection);
    navigate({ name: "library" });
  };

  const body = (() => {
    if (route.name === "library") return <LibraryPage collections={collections} />;
    if (route.name === "new-collection") return <CreateCollectionPage onCreate={create} />;
    if (!activeCollection) return <LibraryPage collections={collections} />;
    if (route.name === "upload") return <UploadPage collection={activeCollection} onAddDocument={addDocument} />;
    if (route.name === "settings") return <CollectionSettingsPage collection={activeCollection} onRename={rename} onRemoveDocument={removeDocument} onDelete={deleteCollection} />;
    return <WorkspacePage collection={activeCollection} />;
  })();

  return <CollectionShell collection={activeCollection}>{body}</CollectionShell>;
}

export function AppRouter() {
  const { session, isLoading } = useSession();
  if (isLoading) return <OnboardingPage />;
  return session ? <ProductApp /> : <OnboardingPage />;
}