export type DocumentStatus = "ready" | "processing" | "failed";

export type CollectionDocument = {
  id: string;
  filename: string;
  size: number;
  pageCount?: number;
  status: DocumentStatus;
  addedAt: string;
  content?: string;
};

export type Collection = {
  id: string;
  name: string;
  createdAt: string;
  lastUsedAt?: string;
  documents: CollectionDocument[];
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  kind?: "not-found";
};