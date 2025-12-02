"use client";

import { cn } from "@/utils";
import {
  animate,
  AnimatePresence,
  motion,
  useDragControls,
  useMotionTemplate,
  useMotionValue,
  useTransform,
} from "framer-motion";
import { useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  onExited?: () => void;
  zIndex: number;
  children: React.ReactNode;
  backgroundImage?: string;
  className?: string;
}

const SHEET_MARGIN = 20;
const SHEET_RADIUS = 12;

const BottomSheet: React.FC<BottomSheetProps> = ({
  open,
  onClose,
  onExited,
  backgroundImage,
  zIndex,
  children,
  className,
}) => {
  const dragControls = useDragControls();

  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 400;

  const height = screenHeight - SHEET_MARGIN;
  const y = useMotionValue(height);
  const bgOpacity = useTransform(y, [0, height], [0.4, 0]);
  const bg = useMotionTemplate`rgba(0, 0, 0, ${bgOpacity})`;

  const scale = useTransform(
    y,
    [0, height],
    [(screenWidth - SHEET_MARGIN) / screenWidth, 1]
  );
  const translate = useTransform(
    y,
    [0, height],
    [SHEET_MARGIN - SHEET_RADIUS, 0]
  );
  const radius = useTransform(y, [0, height], [SHEET_RADIUS, 0]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;
    const unsub1 = scale.on("change", (v) => {
      root.style.scale = `${v}`;
    });
    const unsub2 = translate.on("change", (v) => {
      root.style.translate = `0 ${v}px`;
    });
    const unsub3 = radius.on("change", (v) => {
      root.style.borderRadius = `${v}px`;
    });

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [scale, translate, radius]);

  return (
    <AnimatePresence onExitComplete={onExited}>
      {open && (
        <motion.div
          className="fixed inset-0"
          style={{ backgroundColor: bg, zIndex }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={cn(
              "absolute bottom-0 max-h-[90vh] w-full flex flex-col overflow-y-auto overflow-x-hidden rounded-t-xl bg-white shadow-lg will-change-transform px-3 pb-10",
              className
            )}
            initial={{ y: height }}
            animate={{ y: 0 }}
            exit={{ y: height }}
            transition={{
              duration: 0.5,
              ease: [0.32, 0.72, 0, 1],
            }}
            style={{
              y,
              backgroundImage: `url(${backgroundImage})`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "top",
              backgroundSize: "contain",
              overscrollBehavior: "none",
            }}
            drag="y"
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: height }}
            onDrag={(event, { velocity }) => {
              if (velocity.y < 0) return y.set(0);
            }}
            dragElastic={0}
            onDragEnd={(_, { offset, velocity }) => {
              const shouldClose =
                offset.y > screenHeight * 0.25 || velocity.y > 500;
              if (shouldClose) {
                onClose();
              } else {
                animate(y, 0, {
                  ...{
                    type: "inertia" as const,
                    bounceStiffness: 300,
                    bounceDamping: 40,
                    timeConstant: 300,
                  },
                  min: 0,
                  max: 0,
                });
              }
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle */}
            <motion.div
              className="flex items-center justify-center py-3"
              onPointerDown={(e) => dragControls.start(e)}
              style={{ touchAction: "none" }}
            >
              <div className="h-1.5 w-12 cursor-grab rounded-full bg-gray-400"></div>
            </motion.div>

            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
