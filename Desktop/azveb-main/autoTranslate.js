// =================================================================
// FERMERMARKET.AZ - DİNAMİK AVTOMATİK TƏRCÜMƏ HOOK (useAutoTranslate)
// =================================================================
import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export function useAutoTranslate(originalText, entityType = null, entityId = null, field = null) {
  const locale = useLocale();
  const [translatedText, setTranslatedText] = useState(originalText);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Əgər orijinal dil (AZ) seçilibsə və ya mətn boşdursa tərcüməyə ehtiyac yoxdur
    if (!originalText || locale === "az") {
      setTranslatedText(originalText);
      return;
    }

    let isMounted = true;
    setLoading(true);

    fetch("/api/ai/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: originalText,
        targetLang: locale,
        sourceLang: "az",
        entityType,
        entityId,
        field,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (isMounted && data.translatedText) {
          setTranslatedText(data.translatedText);
        }
      })
      .catch((err) => {
        console.warn("AutoTranslate xətası:", err.message);
        if (isMounted) setTranslatedText(originalText);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [originalText, locale, entityType, entityId, field]);

  return { text: translatedText, loading };
}
