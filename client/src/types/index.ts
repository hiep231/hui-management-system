export * from "./player";

export type TParticipant = {
  playerId: string;
  playerName: string;
  legs: number;
};

export type TModelChildGroup = {
  id: string;
  _id?: string;
  parentId: string;
  name: string;
  groupNumber: number;
  members: any[];
  monthlyStatus: Record<string, any>;
  cycles: any[];
  startDate: string;
  amount: number;
  fee: number;
  totalLegsRegistered: number;
};

export type TModelParentGroups = {
  id: string;
  _id?: string;
  name: string;
  amount: number;
  thaoAmount: number;
  createdDate: string;
  totalParticipants: number;
  totalLegs: number;
};
