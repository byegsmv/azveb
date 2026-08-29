"use client";

export default function Template({ children }: { children: React.ReactNode }) {
  // One-page sistemdə səhifələr arası süni ağ pərdə/loader keçidini ləğv edirik
  return <>{children}</>;
}
