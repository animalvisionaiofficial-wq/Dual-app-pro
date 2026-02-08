
export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  icon: string;
  category: 'social' | 'games' | 'system' | 'productivity';
  clonedCount: number;
}

export interface NavItem {
  label: string;
  icon: string;
  view: 'dashboard' | 'tools' | 'security' | 'docs' | 'settings';
}

export interface DocSection {
  title: string;
  content: string;
  codeSnippet?: string;
  language?: string;
}
