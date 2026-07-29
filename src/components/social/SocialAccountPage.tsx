import React from 'react';
import { SocialAccountProvider } from '../social-manager/SocialAccountContext';
import { SocialDashboard } from '../social-manager/SocialDashboard';

export const SocialAccountPage: React.FC = () => {
  return (
    <SocialAccountProvider>
      <SocialDashboard />
    </SocialAccountProvider>
  );
};
