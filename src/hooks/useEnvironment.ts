import { useState, useEffect } from 'react';
import { EnvironmentService, EnvironmentConfig } from '../services/system/environment.service';

export const useEnvironment = () => {
  const [config, setConfig] = useState<EnvironmentConfig>(() =>
    EnvironmentService.validateEnvironment()
  );

  useEffect(() => {
    setConfig(EnvironmentService.validateEnvironment());
  }, []);

  return config;
};
