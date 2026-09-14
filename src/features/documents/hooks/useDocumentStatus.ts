import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../lib/supabaseClient";

/** Refreshes collection data when the secure ingestion function updates a document. */
export function useDocumentStatus() {
  const client = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("document-ingestion-status")
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "documents" },
        () => void client.invalidateQueries({ queryKey: ["collections"] }),
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [client]);
}
