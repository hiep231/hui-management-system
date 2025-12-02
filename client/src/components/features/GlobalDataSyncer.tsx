import { useGroupedFunds } from "@/hooks/useFundQueries";
import {
  childHuiGroupsAtom,
  parentHuiGroupsAtom,
} from "@/modules/recoil-utils/utils.recoil";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";

const GlobalDataSyncer = () => {
  const { data: groupedFundsData } = useGroupedFunds();

  const setParentHuiGroups = useSetRecoilState(parentHuiGroupsAtom);
  const setChildHuiGroups = useSetRecoilState(childHuiGroupsAtom);

  useEffect(() => {
    if (groupedFundsData && Array.isArray(groupedFundsData)) {
      const allParents: any[] = [];
      const allChildren: any[] = [];

      groupedFundsData.forEach((group: any) => {
        if (group.funds && group.funds.length > 0) {
          const firstChild = group.funds[0];
          const parentGroupId = JSON.stringify(group._id);

          const groupName = `Hụi ${group._id.amount / 1000}k (Thảo ${
            group._id.fee / 1000
          }k) - T${group._id.startMonth}/${group._id.startYear}`;

          const parent = {
            id: parentGroupId,
            name: groupName,
            amount: firstChild.amount,
            thaoAmount: firstChild.fee,
            createdDate: firstChild.startDate,
            totalParticipants: group.count,
            totalLegs: firstChild.totalLegsRegistered,
          };

          allParents.push(parent);

          group.funds.forEach((fund: any) => {
            allChildren.push({
              ...fund,
              id: fund._id,
              parentId: parentGroupId,
            });
          });
        }
      });

      console.log("🔄 GlobalDataSyncer: Đã đồng bộ dữ liệu hụi vào Recoil");
      setParentHuiGroups(allParents);
      setChildHuiGroups(allChildren);
    }
  }, [groupedFundsData, setParentHuiGroups, setChildHuiGroups]);

  return null;
};

export default GlobalDataSyncer;
