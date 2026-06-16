"use client";

import { createContext, useContext, useState } from "react";

type Ctx = {
  overrides: Record<string, string>;
  isEditor: boolean;
  canEdit: boolean;
  setLocalOverride: (key: string, value: string | null) => void;
};

const ContentContext = createContext<Ctx>({
  overrides: {},
  isEditor: false,
  canEdit: false,
  setLocalOverride: () => {},
});

export function ContentProvider({
  children,
  overrides: initial,
  isEditor,
  canEdit,
}: {
  children: React.ReactNode;
  overrides: Record<string, string>;
  isEditor: boolean;
  canEdit: boolean;
}) {
  const [overrides, setOverrides] = useState(initial);
  function setLocalOverride(key: string, value: string | null) {
    setOverrides((prev) => {
      const next = { ...prev };
      if (value === null) delete next[key];
      else next[key] = value;
      return next;
    });
  }
  return (
    <ContentContext.Provider value={{ overrides, isEditor, canEdit, setLocalOverride }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContentCtx() {
  return useContext(ContentContext);
}

export function useContentValue(key: string, defaultValue: string): string {
  const { overrides } = useContext(ContentContext);
  return overrides[key] ?? defaultValue;
}
