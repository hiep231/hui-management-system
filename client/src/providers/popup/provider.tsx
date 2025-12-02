import { createContext, ReactNode, useEffect, useState } from "react";
import { Popup } from "./ui";
import eventBus from "@/utils/bus";

interface PopupContextProps {
  open: (
    content: ReactNode,
    options?: { disableOverlayClose?: boolean }
  ) => void;
  close: () => void;
}

export const PopupContext = createContext<PopupContextProps | undefined>(
  undefined
);

export const PopupProvider = ({ children }: { children: ReactNode }) => {
  const [content, setContent] = useState<ReactNode | null>(null);
  const [disableOverlayClose, setDisableOverlayClose] = useState(false);

  const open: PopupContextProps["open"] = (content, options) => {
    setContent(content);
    setDisableOverlayClose(!!options?.disableOverlayClose);
  };

  const close = () => {
    setContent(null);
    setDisableOverlayClose(false);
  };

  useEffect(() => {
    eventBus.on("open-popup", (content) => open(content));
    eventBus.on("close-popup", close);
    return () => {
      eventBus.off("open-popup", (content) => open(content));
      eventBus.off("close-popup", close);
    };
  }, []);
  return (
    <PopupContext.Provider value={{ open, close }}>
      {children}

      <Popup open={!!content} onClose={disableOverlayClose ? undefined : close}>
        {content}
      </Popup>
    </PopupContext.Provider>
  );
};
