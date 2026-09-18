export type DocumentStatus = "pending" | "embedding" | "ready" | "failed";

export type CollectionDocument = {
  id: string;
  filename: string;
  storagePath: string;
  size: number;
  pageCount?: number;
  chunkCount?: number;
  embeddedChunkCount?: number;
  status: DocumentStatus;
  addedAt: string;
  content?: string;
};

export type Collection = {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt?: string;
  openCount: number;
  documents: CollectionDocument[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  kind?: "not-found";
};