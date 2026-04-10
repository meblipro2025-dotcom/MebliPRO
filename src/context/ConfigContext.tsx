"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

export type ProjectNiche = "kitchen" | "wardrobe" | "other" | null;
export type ContactMethod = "telegram" | "whatsapp" | "viber" | "call" | null;

interface ConfiguratorState {
  niche: ProjectNiche;
  step: number;
  
  // Kitchen
  kitchen: {
    shape: "corner" | "u-shape" | "straight" | null;
    dims: { a: string; b: string; c: string; h: string };
    facadeType: "shpon" | "mdf-film" | "mdf-paint" | "ldsp" | null;
    hasMilling: boolean;
    hasCountertop: boolean;
    countertopMaterial: "stone" | "acrylic" | "mdf" | "ldsp" | null;
    countertopThickness: "28" | "38" | null;
    hasAppliances: boolean;
    appliancesDetail: string;
  };

  // Wardrobe
  wardrobe: {
    shape: "corner" | "straight" | null;
    dims: { w1: string; w2: string; h: string; d: string };
    isBuiltIn: boolean | null;
    doorType: "sliding" | "hinged" | null;
  };

  // Other / Generic
  description: string;
  files: string[];

  // User
  client: { name: string; phone: string; method: ContactMethod };
}

interface ConfigContextType {
  state: ConfiguratorState;
  updateState: (updates: any) => void;
  resetState: () => void;
  nextStep: () => void;
  prevStep: () => void;
}

const initialState: ConfiguratorState = {
  niche: null,
  step: 1,
  kitchen: {
    shape: null,
    dims: { a: "", b: "", c: "", h: "2400" },
    facadeType: null,
    hasMilling: false,
    hasCountertop: false,
    countertopMaterial: null,
    countertopThickness: null,
    hasAppliances: false,
    appliancesDetail: "",
  },
  wardrobe: {
    shape: null,
    dims: { w1: "", w2: "", h: "2400", d: "600" },
    isBuiltIn: null,
    doorType: null,
  },
  description: "",
  files: [],
  client: { name: "", phone: "", method: null },
};

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ConfiguratorState>(initialState);

  const updateState = (updates: any) => {
    setState((prev: any) => {
      const newState = { ...prev };
      Object.keys(updates).forEach((key) => {
        if (typeof updates[key] === 'object' && updates[key] !== null && !Array.isArray(updates[key])) {
          newState[key] = { ...prev[key], ...updates[key] };
        } else {
          newState[key] = updates[key];
        }
      });
      return newState;
    });
  };

  const resetState = () => setState(initialState);
  const nextStep = () => setState(prev => ({ ...prev, step: prev.step + 1 }));
  const prevStep = () => setState(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));

  return (
    <ConfigContext.Provider value={{ state, updateState, resetState, nextStep, prevStep }}>
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfigurator() {
  const context = useContext(ConfigContext);
  if (!context) throw new Error("useConfigurator must be used within a ConfigProvider");
  return context;
}
