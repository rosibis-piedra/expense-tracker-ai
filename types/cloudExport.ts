export type CloudProvider = 'google-sheets' | 'dropbox' | 'onedrive' | 'email' | 'link';
export type ExportTemplate = 'tax-report' | 'monthly-summary' | 'category-analysis' | 'full-export';
export type ScheduleFrequency = 'daily' | 'weekly' | 'monthly' | 'never';

export interface ExportHistory {
  id: string;
  timestamp: string;
  template: ExportTemplate;
  provider: CloudProvider;
  recordCount: number;
  totalAmount: number;
  status: 'success' | 'pending' | 'failed';
  destination: string;
}

export interface CloudIntegration {
  provider: CloudProvider;
  connected: boolean;
  lastSync?: string;
  accountEmail?: string;
}

export interface ScheduledExport {
  id: string;
  template: ExportTemplate;
  frequency: ScheduleFrequency;
  provider: CloudProvider;
  destination: string;
  enabled: boolean;
  nextRun?: string;
}

export interface ExportTemplateConfig {
  id: ExportTemplate;
  name: string;
  description: string;
  icon: string;
  fields: string[];
  format: 'csv' | 'xlsx' | 'pdf';
}

export interface ShareableLink {
  id: string;
  url: string;
  expiresAt: string;
  password?: string;
  viewCount: number;
  createdAt: string;
}
