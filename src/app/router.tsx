import { useMemo, useState } from "react";
import { useSession } from "../features/auth/hooks/useSession";
import { CollectionShell } from "../features/collections/components/CollectionShell";
import { CreateCollectionPage } from "../features/collections/pages/CreateCollectionPage";
import { CollectionSettingsPage } from "../features/collections/pages/CollectionSettingsPage";
import { LibraryPage } from "../features/collections/pages/LibraryPage";
import { UploadPage } from "../features/collections/pages/UploadPage";
import { WorkspacePage } from "../features/collections/pages/WorkspacePage";
import type { Collection, CollectionDocument } from "../features/collections/types/domain";
import { navigate, useAppRoute } from "./navigation";
import { OnboardingPage } from "../features/onboarding/pages/OnboardingPage";

function createId(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function ProductApp() {
  const route = useAppRoute() ?? { name: "library" as const };
  const [collections, setCollections] = useState<Collection[]>([]);
  const activeCollection = "collectionId" in route ? collections.find((collection) => collection.id === route.collectionId) : undefined;

  const collectionActions = useMemo(() => ({
    createCollection(name: string) {
      const collection: Collection = { id: createId("collection"), name, createdAt: new Date().toISOString(), documents: [] };
      setCollections((current) => [collection, ...current]);
      navigate({ name: "upload", collectionId: collection.id });
    },
    renameCollection(collectionId: string, name: string) {
      setCollections((current) => current.map((collection) => collection.id === collectionId ? { ...collection, name } : collection));
    },
    addDocument(collectionId: string, file: File) {
      const document: CollectionDocument = {
        id: createId("document"), filename: file.name, size: file.size, status: "ready", pageCount: file.type === "application/pdf" ? undefined : 1, addedAt: new Date().toISOString(),
        content: "Your selected document will be parsed into page-aware passages during the ingestion phase.",
      };
      setCollections((current) => current.map((collection) => collection.id === collectionId ? { ...collection, lastUsedAt: new Date().toISOString(), documents: [...collection.documents, document] } : collection));
    },
    removeDocument(collectionId: string, documentId: string) {
      setCollections((current) => current.map((collection) => collection.id === collectionId ? { ...collection, documents: collection.documents.filter((document) => document.id !== documentId) } : collection));
    },
    deleteCollection(collectionId: string) {
      setCollections((current) => current.filter((collection) => collection.id !== collectionId));
      navigate({ name: "library" });
    },
  }), []);

  const body = (() => {
    if (route.name === "library") return <LibraryPage collections={collections} />;
    if (route.name === "new-collection") return <CreateCollectionPage onCreate={collectionActions.createCollection} />;
    if (!activeCollection) return <LibraryPage collections={collections} />;
    if (route.name === "upload") return <UploadPage collection={activeCollection} onAddDocument={collectionActions.addDocument} />;
    if (route.name === "settings") return <CollectionSettingsPage collection={activeCollection} onRename={collectionActions.renameCollection} onRemoveDocument={collectionActions.removeDocument} onDelete={collectionActions.deleteCollection} />;
    return <WorkspacePage collection={activeCollection} />;
  })();

  return <CollectionShell collection={activeCollection}>{body}</CollectionShell>;
}

export function AppRouter() {
  const { session, isLoading } = useSession();
  const route = useAppRoute();
  const isProductPreview = route !== null;

  if (isLoading && !isProductPreview) return <OnboardingPage />;
  return session || isProductPreview ? <ProductApp /> : <OnboardingPage />;
}