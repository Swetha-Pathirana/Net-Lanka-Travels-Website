import { createContext, useContext, useState } from "react";

const FloatingButtonsContext = createContext();

export function FloatingButtonsProvider({ children }) {
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isScrollVisible, setIsScrollVisible] = useState(false);

  return (
    <FloatingButtonsContext.Provider
      value={{
        isWhatsAppOpen,
        setIsWhatsAppOpen,
        isScrollVisible,
        setIsScrollVisible,
      }}
    >
      {children}
    </FloatingButtonsContext.Provider>
  );
}

export const useFloatingButtons = () => useContext(FloatingButtonsContext);
