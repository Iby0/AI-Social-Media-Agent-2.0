import { useState, useCallback } from 'react';
import { PromptTemplateModel, AIInputModel } from '../types/ai';
import { promptService } from '../services/ai/prompt.service';
import { SocialPlatform } from '../database/types';

export function usePrompt() {
  const [templates, setTemplates] = useState<PromptTemplateModel[]>(() =>
    promptService.getTemplates()
  );

  const getTemplateForInput = useCallback((feature: any, platform: SocialPlatform) => {
    return promptService.getTemplateForInput(feature, platform);
  }, []);

  const interpolate = useCallback((templateStr: string, input: AIInputModel) => {
    return promptService.interpolateTemplate(templateStr, input);
  }, []);

  const addCustomTemplate = useCallback(
    (templateData: Omit<PromptTemplateModel, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
      const created = promptService.registerCustomTemplate(templateData);
      setTemplates([...promptService.getTemplates()]);
      return created;
    },
    []
  );

  const validate = useCallback((templateStr: string) => {
    return promptService.validateTemplate(templateStr);
  }, []);

  return {
    templates,
    getTemplateForInput,
    interpolate,
    addCustomTemplate,
    validate,
  };
}
