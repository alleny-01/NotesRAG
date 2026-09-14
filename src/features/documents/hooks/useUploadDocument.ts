import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadDocument } from "../../collections/api";

export function useUploadDocument() {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({ collectionId, file }: { collectionId: string; file: File }) => uploadDocument(collectionId, file),
    onSuccess: () => client.invalidateQueries({ queryKey: ["collections"] }),
  });
}