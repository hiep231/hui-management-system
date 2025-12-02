import { createContext, useContext } from "react";
import { TModelChildGroup, TModelParentGroups } from "@/types";
import { TModelPlayer } from "@/types/player";

type PlayerContextType = {
  selectedPlayer: TModelPlayer;
  childGroup?: TModelChildGroup;
  parentGroup?: TModelParentGroups;
};

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = PlayerContext.Provider;

export const usePlayerContext = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx)
    throw new Error("usePlayerContext must be used inside PlayerProvider");
  return ctx;
};
