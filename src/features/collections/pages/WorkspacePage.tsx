import { useState, type FormEvent } from "react";
import {
  ArrowUpRight,
  BookOpen,
  FileText,
  MessageCircle,
  SearchX,
  Send,
  Sparkles,
} from "lucide-react";
import { navigate } from "../../../app/navigation";
import type { ChatMessage, Collection } from "../types/domain";

type WorkspacePageProps = { collection: Collection };
type WorkspaceTab = "chat" | "notes";

function SourcePane({ collection }: { collection: Collection }) {
  const document = collection.documents[0];
  if (!document)
    return (
      <section className="grid min-h-[420px] place-items-center bg-[#f5f0e8] p-8 text-center text-[#332c2d]">
        <div>
          <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[#e9dfd1] text-[var(--purple)]">
            <BookOpen size={20} />
          </div>
          <h2 className="mt-4 font-[var(--serif)] text-[32px] leading-none tracking-[-0.055em]">
            No notes to read yet.
          </h2>
          <p className="mt-3 max-w-xs text-[13px] leading-6 text-[#756b64]">
            Add a text-based PDF or note before opening a conversation.
          </p>
        </div>
      </section>
    );
  return (
    <section className="h-full bg-[#f5f0e8] text-[#332c2d]">
      <div className="flex h-12 items-center justify-between bg-[rgba(223,212,197,0.45)] px-4">
        <div className="flex min-w-0 items-center gap-2 text-[11px] text-[#776d65]">
          <FileText size={14} />
          <span className="truncate">{document.filename}</span>
        </div>
        <span className="shrink-0 text-[10px] uppercase tracking-[0.12em] text-[#91857a]">
          Source
        </span>
      </div>
      <article className="mx-auto max-w-2xl px-6 py-10 sm:px-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#92867b]">
          Reading passage · page 1
        </p>
        <h2 className="mt-4 font-[var(--serif)] text-[20px] font-light leading-none tracking-[-0.045em]">
          The source will stay beside the answer.
        </h2>
        <div className="my-8 h-px bg-[#dcd0c2]" />
        <p className="font-[var(--serif)] text-[19px] leading-8 text-[#574a45]">
          When retrieval is connected, a cited answer will open the exact
          passage that supported it here. The source viewer keeps the original
          material close enough to verify the answer without losing your place.
        </p>
        <p className="mt-7 bg-[rgba(156,115,200,0.14)] px-4 py-3 shadow-[inset_3px_0_0_var(--purple)] font-[var(--serif)] text-[17px] leading-7 text-[#4d3a56]">
          {document.content}
        </p>
        <p className="mt-8 text-[13px] leading-6 text-[#756b64]">
          The upload, extraction, chunking, embedding, and precise passage
          highlight will be wired into this viewer during the ingestion and RAG
          phase.
        </p>
      </article>
    </section>
  );
}

function EmptyChat({
  onOpenUpload,
  hasDocuments,
}: {
  onOpenUpload: () => void;
  hasDocuments: boolean;
}) {
  return (
    <div className="grid min-h-[420px] place-items-center px-6 text-center">
      <div className="max-w-sm">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-[var(--lilac)] text-[var(--purple)]">
          <MessageCircle size={20} />
        </div>
        <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--purple)]">
          {hasDocuments ? "No messages yet" : "No documents yet"}
        </p>
        <h2 className="mt-3 font-[var(--serif)] text-[20px] font-light leading-none tracking-[-0.045em]">
          {hasDocuments
            ? "Start with what you want to understand."
            : "Bring in a source first."}
        </h2>
        <p className="mt-4 text-[13px] leading-6 text-[var(--body)]">
          {hasDocuments
            ? "Ask a focused question and NotesRAG will only answer from the passages it retrieves."
            : "Add a text-based PDF or plain note before starting a source-grounded conversation."}
        </p>
        <button
          type="button"
          onClick={onOpenUpload}
          className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium text-[var(--purple)] hover:text-[var(--purple-dark)]"
        >
          {hasDocuments ? "Add more notes" : "Add source material"}{" "}
          <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}

export function WorkspacePage({ collection }: WorkspacePageProps) {
  const [tab, setTab] = useState<WorkspaceTab>("chat");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const hasDocuments = collection.documents.length > 0;
  const submitQuestion = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const question = draft.trim();
    if (!question || !hasDocuments) return;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content: question },
      {
        id: crypto.randomUUID(),
        role: "assistant",
        kind: "not-found",
        content: "Nothing in your notes covers that yet.",
      },
    ]);
    setDraft("");
  };
  const openUpload = () =>
    navigate({ name: "upload", collectionId: collection.id });

  return (
    <main className="mx-auto flex w-full max-w-[1600px] flex-col px-4 py-5 sm:px-6 lg:h-[calc(100vh-6.75rem)] lg:px-9 lg:py-7">
      <div className="mb-4 flex items-center justify-between lg:mb-5">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--purple)]">
            Collection workspace
          </p>
          <h1 className="mt-1 font-[var(--serif)] text-[20px] font-light leading-none tracking-[-0.045em]">
            {collection.name}
          </h1>
        </div>
        <button
          type="button"
          onClick={openUpload}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-white shadow-[0_4px_12px_rgba(66,47,39,0.07)] px-3 text-[12px] text-[var(--body)] transition hover:border-[var(--purple)] hover:text-[var(--purple)]"
        >
          <FileText size={15} /> Add notes
        </button>
      </div>
      <div className="mb-3 grid grid-cols-2 bg-[var(--paper)] p-1 shadow-[0_6px_16px_rgba(66,47,39,0.05)] lg:hidden">
        <button
          type="button"
          onClick={() => setTab("chat")}
          className={`h-9 text-[12px] transition-all duration-200 ease-out hover:bg-[rgba(95,61,130,0.08)] ${tab === "chat" ? "bg-[var(--purple)] text-white" : "text-[var(--body)]"}`}
        >
          Chat
        </button>
        <button
          type="button"
          onClick={() => setTab("notes")}
          className={`h-9 text-[12px] transition-all duration-200 ease-out hover:bg-[rgba(95,61,130,0.08)] ${tab === "notes" ? "bg-[var(--purple)] text-white" : "text-[var(--body)]"}`}
        >
          Notes
        </button>
      </div>
      <div className="grid min-h-[610px] flex-1 gap-1 overflow-hidden bg-[var(--paper)] shadow-[0_18px_42px_rgba(66,47,39,0.08)] lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <section
          className={`${tab === "chat" ? "block" : "hidden"} min-h-0 bg-[var(--cream)] lg:flex lg:flex-col`}
        >
          <div className="flex h-12 items-center justify-between bg-[rgba(241,236,227,0.72)] px-4">
            <span className="text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--muted)]">
              Conversation
            </span>
            <span className="inline-flex items-center gap-1.5 text-[10px] text-[var(--purple)]">
              <Sparkles size={12} /> Grounded mode
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <EmptyChat
                hasDocuments={hasDocuments}
                onOpenUpload={openUpload}
              />
            ) : (
              <div className="space-y-5 p-5">
                {messages.map((message) =>
                  message.role === "user" ? (
                    <div
                      key={message.id}
                      className="ml-auto max-w-[85%] rounded-md bg-[var(--purple)] px-4 py-3 text-[13px] leading-6 text-white"
                    >
                      {message.content}
                    </div>
                  ) : (
                    <div
                      key={message.id}
                      className="max-w-[92%] bg-[var(--paper)] px-4 py-3 shadow-[inset_3px_0_0_var(--purple)]"
                    >
                      <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-[var(--purple)]">
                        <SearchX size={13} /> Not found in your notes
                      </p>
                      <p className="text-[13px] leading-6 text-[var(--body)]">
                        {message.content}
                      </p>
                      <p className="mt-2 text-[11px] leading-5 text-[var(--muted)]">
                        No generation was used because the collection did not
                        return a relevant passage.
                      </p>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
          <form
            onSubmit={submitQuestion}
            className="bg-white p-3"
          >
            <div className="flex items-end gap-2 rounded-md bg-[var(--paper)] px-3 py-2 shadow-[inset_0_0_0_1px_rgba(222,214,203,0.55)] transition focus-within:border-[var(--purple)] focus-within:ring-4 focus-within:ring-[rgba(95,61,130,0.10)]">
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                disabled={!hasDocuments}
                rows={1}
                placeholder={
                  hasDocuments
                    ? "Ask about your notes…"
                    : "Add notes before asking a question"
                }
                className="max-h-28 min-h-7 flex-1 resize-none bg-transparent py-1 text-[13px] leading-5 outline-none placeholder:text-[#aaa19a] disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={!draft.trim() || !hasDocuments}
                className="grid h-8 w-8 shrink-0 place-items-center rounded bg-[var(--purple)] text-white transition duration-200 ease-out hover:-translate-y-px hover:bg-[var(--purple-dark)] active:translate-y-0 disabled:bg-[#c4b6cf]"
                aria-label="Send question"
              >
                <Send size={14} />
              </button>
            </div>
            <p className="mt-2 px-1 text-[10px] text-[var(--muted)]">
              Answers will cite supporting passages when retrieval is connected.
            </p>
          </form>
        </section>
        <div
          className={`${tab === "notes" ? "block" : "hidden"} min-h-0 overflow-y-auto lg:block`}
        >
          <SourcePane collection={collection} />
        </div>
      </div>
    </main>
  );
}
