'use client';

import ContentPlanTable from './ContentPlanTable';
import { Content, UserRole } from '@/types';

type ReelsPlanTableProps = {
  reels: Content[];
  projectId: string;
  month: string;
  userRole: UserRole;
};

export default function ReelsPlanTable({ reels, projectId, month, userRole }: ReelsPlanTableProps) {
  // Reels Plan uses the same structure as Content Plan
  // Just with different data (reels instead of regular content)
  return (
    <div>
      <ContentPlanTable 
        content={reels}
        projectId={projectId}
        month={month}
        userRole={userRole}
      />
    </div>
  );
}

