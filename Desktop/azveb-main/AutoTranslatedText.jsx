// =================================================================
// FERMERMARKET.AZ - DİNAMİK AVTOMATİK TƏRCÜMƏ KOMPONENTİ
// =================================================================
"use client";
import React from "react";
import { useAutoTranslate } from "@/lib/autoTranslate";

export default function AutoTranslatedText({ text, entityType, entityId, field, className = "" }) {
  const { text: translated, loading } = useAutoTranslate(text, entityType, entityId, field);

  return (
    <span className={`${className} ${loading ? "opacity-75 transition-opacity" : ""}`}>
      {translated || text}
    </span>
  );
}
