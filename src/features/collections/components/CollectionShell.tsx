import { type PropsWithChildren } from "react";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  FolderOpen,
  Plus,
  Settings,
} from "lucide-react";
import type { Collection } from "../types/domain";
import { navigate } from "../../../app/navigation";

type CollectionShellProps = PropsWithChildren<{ collection?: Collection }>;

export function CollectionShell({
  collection,
  children,
}: CollectionShellProps) {
  return (
    <div className="min-h-screen bg-[var(--canvas)] font-[var(--sans)] text-[var(--ink)]">
      <header className="sticky top-0 z-30 bg-[color:color-mix(in_srgb,var(--canvas)_90%,transparent)] backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-9">
          <div className="flex min-w-0 items-center gap-4 sm:gap-7">
            <button
              type="button"
              onClick={() => navigate({ name: "library" })}
              className="flex shrink-0 items-center gap-2 text-[17px] font-semibold tracking-[-0.055em] text-[var(--ink)]"
            >
              <img src="favicon.png" alt="" className="h-6 w-6" />
              <span>NotesRAG</span>
            </button>
            {collection && (
              <>
                <span className="hidden h-5 w-px bg-[var(--line)] sm:block" />
                <div className="hidden min-w-0 items-center gap-2 text-[12px] text-[var(--body)] sm:flex">
                  <FolderOpen size={14} className="text-[var(--purple)]" />
                  <span className="truncate">{collection.name}</span>
                  <ChevronDown size={13} />
                </div>
              </>
            )}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {collection && (
              <button
                type="button"
                onClick={() =>
                  navigate({ name: "settings", collectionId: collection.id })
                }
                className="inline-flex h-9 items-center gap-2 rounded-md px-2.5 text-[12px] text-[var(--body)] transition duration-200 ease-out hover:-translate-y-px hover:bg-[var(--paper)] hover:text-[var(--ink)] active:translate-y-0"
              >
                <Settings size={15} />
                <span className="hidden sm:inline">Settings</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate({ name: "new-collection" })}
              className="inline-flex h-9 items-center gap-2 rounded-md bg-[var(--purple)] px-3 text-[12px] font-medium text-white transition duration-200 ease-out hover:-translate-y-px hover:bg-[var(--purple-dark)] active:translate-y-0"
            >
              <Plus size={15} />
              <span className="hidden sm:inline">New collection</span>
              <span className="sm:hidden">New</span>
            </button>
          </div>
        </div>
      </header>
      {collection && (
        <div className="bg-[var(--cream)]">
          <div className="mx-auto flex h-11 max-w-[1600px] items-center gap-2 px-4 text-[11px] text-[var(--muted)] sm:px-6 lg:px-9">
            <button
              onClick={() => navigate({ name: "library" })}
              className="inline-flex items-center gap-1 transition duration-200 ease-out hover:translate-x-0.5 hover:text-[var(--purple)]"
            >
              <ArrowLeft size={12} /> Library
            </button>
            <span>/</span>
            <button
              onClick={() =>
                navigate({ name: "workspace", collectionId: collection.id })
              }
              className="inline-flex items-center gap-1 text-[var(--body)] transition duration-200 ease-out hover:translate-x-0.5 hover:text-[var(--purple)]"
            >
              <BookOpen size={12} /> {collection.name}
            </button>
          </div>
        </div>
      )}
      {children}
    </div>
  );
}
