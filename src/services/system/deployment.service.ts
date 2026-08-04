export interface DeploymentTarget {
  name: string;
  configFileName: string;
  recommendedCommand: string;
  status: 'Ready' | 'Configured' | 'Optional';
}

export class DeploymentService {
  static getDeploymentTargets(): DeploymentTarget[] {
    return [
      {
        name: 'Vercel',
        configFileName: 'vercel.json',
        recommendedCommand: 'vercel --prod',
        status: 'Ready',
      },
      {
        name: 'Netlify',
        configFileName: 'netlify.toml',
        recommendedCommand: 'netlify deploy --prod',
        status: 'Ready',
      },
      {
        name: 'GitHub Pages',
        configFileName: '.github/workflows/ci.yml',
        recommendedCommand: 'git push origin main',
        status: 'Ready',
      },
    ];
  }
}
