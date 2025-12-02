import { TModelChildGroup, TModelParentGroups } from "@/types";
import { TModelPlayer } from "@/types/player";
import { atom } from "recoil";

export const parentHuiGroupsAtom = atom<TModelParentGroups[]>({
  key: "parentHuiGroupsAtom",
  default: [],
});

export const childHuiGroupsAtom = atom<TModelChildGroup[]>({
  key: "childHuiGroupsAtom",
  default: [],
});

export const playersOfHuiGroupsAtom = atom<TModelPlayer[]>({
  key: "playersOfHuiGroupsAtom",
  default: [],
});

export const selectedPlayerAtom = atom<any>({
  key: "selectedPlayerAtom",
  default: null,
});

export const selectedGroupAtom = atom<any>({
  key: "selectedGroupAtom",
  default: null,
});
