import { createContext, useCallback, useMemo, useRef, useState } from "react";

import BottomSheet from "@/providers/bottomSheet/ui";

interface BottomSheetOptions {
  zIndex?: number;
  overlayClose?: boolean;
  onClose?: () => void;
  backgroundImage?: string;
  className?: string;
}

interface BottomSheetState {
  isOpen: boolean;
  content: React.ReactNode | null;
  options: BottomSheetOptions;
}

interface BottomSheetContextType {
  open: (
    content: React.ReactNode,
    options?: BottomSheetOptions
  ) => Promise<void>;
  close: () => void;
  isOpen: boolean;
}

const defaultOptions: BottomSheetOptions = {
  zIndex: 1500,
  overlayClose: true,
};

export const BottomSheetContext = createContext<
  BottomSheetContextType | undefined
>(undefined);

export const BottomSheetProvider: React.FC<{
  children: React.ReactNode;
  defaultOptions?: Partial<BottomSheetOptions>;
}> = ({ children, defaultOptions: providerDefaultOptions }) => {
  const hideResolveRef = useRef<(() => void) | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [bottomSheetState, setBottomSheetState] = useState<BottomSheetState>({
    isOpen: false,
    content: null,
    options: {
      ...defaultOptions,
      ...providerDefaultOptions,
    },
  });

  const resolveRef = useRef<(() => void) | null>(null);

  const mergedOptions = useMemo(
    () => ({
      ...defaultOptions,
      ...providerDefaultOptions,
    }),
    [providerDefaultOptions]
  );

  const queueRef = useRef<(() => Promise<void>)[]>([]);

  const processQueue = async () => {
    if (queueRef.current.length === 0 || isTransitioning) return;
    const action = queueRef.current.shift();
    if (action) await action();
  };

  const enqueue = (fn: () => Promise<void>) => {
    queueRef.current.push(fn);
    processQueue();
  };

  const open = (content: React.ReactNode, options: BottomSheetOptions = {}) => {
    return new Promise<void>((resolve) => {
      enqueue(async () => {
        await close();
        await new Promise<void>((innerResolve) => {
          resolveRef.current = () => {
            innerResolve();
            resolve();
          };
          setBottomSheetState({
            isOpen: true,
            content,
            options: {
              ...mergedOptions,
              ...options,
            },
          });
        });
      });
    });
  };

  const close = useCallback(() => {
    return new Promise<void>((resolve) => {
      setIsTransitioning(true);

      setBottomSheetState((prev) => {
        if (!prev.isOpen) {
          setIsTransitioning(false);
          resolve();
          return prev;
        }

        if (prev.options.onClose) {
          prev.options.onClose();
        }

        hideResolveRef.current = () => {
          setIsTransitioning(false);
          resolve();
        };

        return { ...prev, isOpen: false };
      });

      hideResolveRef.current = () => {
        setIsTransitioning(false);
        resolve();
      };
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      open,
      close,
      isOpen: bottomSheetState.isOpen,
    }),
    [open, close, bottomSheetState.isOpen]
  );

  return (
    <BottomSheetContext.Provider value={contextValue}>
      {children}
      <BottomSheet
        open={bottomSheetState.isOpen}
        onClose={bottomSheetState.options.overlayClose ? close : () => {}}
        onExited={() => {
          hideResolveRef.current?.();
          hideResolveRef.current = null;
        }}
        backgroundImage={bottomSheetState.options.backgroundImage}
        zIndex={bottomSheetState.options.zIndex ?? defaultOptions.zIndex!}
        className={bottomSheetState.options.className}
      >
        {bottomSheetState.content}
      </BottomSheet>
      {isTransitioning && (
        <div className="pointer-events-auto fixed inset-0 z-[9999] bg-transparent" />
      )}
    </BottomSheetContext.Provider>
  );
};
