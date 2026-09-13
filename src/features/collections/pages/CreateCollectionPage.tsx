import { useState, type FormEvent } from "react";
import { ArrowRight, BookOpen, ChevronLeft, FolderPlus } from "lucide-react";
import { navigate } from "../../../app/navigation";

type CreateCollectionPageProps = { onCreate: (name: string) => void };

export function CreateCollectionPage({ onCreate }: CreateCollectionPageProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = name.trim();
    if (value.length < 2) {
      setError("Give this collection a name with at least 2 characters.");
      return;
    }
    onCreate(value);
  };

  return (
    <main className="mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-[1600px] items-center px-4 py-10 sm:px-6 lg:px-9">
      <div className="grid w-full gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(360px,0.7fr)] lg:items-center lg:gap-24">
        <section>
          <button
            type="button"
            onClick={() => navigate({ name: "library" })}
            className="mb-9 inline-flex items-center gap-1.5 text-[12px] text-[var(--body)] transition hover:text-[var(--purple)]"
          >
            <ChevronLeft size={15} /> Back to library
          </button>
          <p className="mb-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--purple)]">
            <FolderPlus size={13} /> New collection
          </p>
          <h1 className="max-w-xl font-[var(--serif)] text-[20px] font-light leading-[0.96] tracking-[-0.075em]">
            Give your material a home.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-7 text-[var(--body)]">
            Collections keep a course or topic’s documents and conversations
            together. Start broad—you can add or remove sources later.
          </p>
        </section>
        <section className="bg-[var(--cream)] p-6 shadow-[0_18px_50px_rgba(66,47,39,0.07)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(66,47,39,0.11)] sm:p-8">
          <form onSubmit={onSubmit}>
            <label
              htmlFor="collection-name"
              className="text-[12px] font-semibold text-[var(--ink)]"
            >
              What are you studying?
            </label>
            <input
              id="collection-name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                setError("");
              }}
              placeholder="e.g. Data structures, Biology 101"
              autoFocus
              className="mt-3 h-12 w-full rounded-md border border-[var(--line)] bg-white px-3.5 text-[14px] outline-none transition placeholder:text-[#aaa19a] focus:border-[var(--purple)] focus:ring-4 focus:ring-[rgba(95,61,130,0.12)]"
            />
            {error && (
              <p className="mt-2 text-[12px] text-[#9b3f43]" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-[var(--purple)] px-4 text-[13px] font-medium text-white transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-[var(--purple-dark)] active:translate-y-0"
            >
              Create collection <ArrowRight size={16} />
            </button>
          </form>
          <div className="mt-8 bg-[var(--paper)] p-4">
            <div className="flex items-start gap-3">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-[var(--lilac)] text-[var(--purple)]">
                <BookOpen size={16} />
              </div>
              <p className="text-[12px] leading-5 text-[var(--body)]">
                <strong className="font-semibold text-[var(--ink)]">
                  A simple rule:
                </strong>{" "}
                keep documents that belong to the same study context together.
                This makes retrieval more precise later.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
