"use client";

import { useState } from "react";

import type { GalleryUploadRowState } from "@/interfaces/admin/work-editor";

function createGalleryUploadRow(index = 0): GalleryUploadRowState {
  return {
    alt: "",
    id: `gallery-upload-${index}`,
  };
}

export function useAdminGalleryUploadRows() {
  const [galleryUploadRows, setGalleryUploadRows] = useState<
    GalleryUploadRowState[]
  >(() => [createGalleryUploadRow(0)]);

  return {
    addGalleryUploadRow() {
      setGalleryUploadRows((currentRows) => [
        ...currentRows,
        createGalleryUploadRow(currentRows.length),
      ]);
    },
    galleryUploadRows,
    removeGalleryUploadRow(id: string) {
      setGalleryUploadRows((currentRows) => {
        const nextRows = currentRows.filter((row) => row.id !== id);

        return nextRows.length ? nextRows : [createGalleryUploadRow(0)];
      });
    },
    updateGalleryUploadRow(id: string, alt: string) {
      setGalleryUploadRows((currentRows) =>
        currentRows.map((row) => (row.id === id ? { ...row, alt } : row)),
      );
    },
  };
}
