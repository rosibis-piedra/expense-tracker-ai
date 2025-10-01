'use client';

import { useState, useEffect } from 'react';
import { Expense } from '@/types/expense';
import {
  CloudProvider,
  ExportTemplate,
  ExportHistory,
  CloudIntegration,
  ScheduledExport,
  ExportTemplateConfig,
  ShareableLink,
  ScheduleFrequency,
} from '@/types/cloudExport';
import { formatCurrency } from '@/lib/utils';

interface CloudExportHubProps {
  expenses: Expense[];
  isOpen: boolean;
  onClose: () => void;
}

const EXPORT_TEMPLATES: ExportTemplateConfig[] = [
  {
    id: 'tax-report',
    name: 'Tax Report',
    description: 'IRS-ready expense report with categorized deductions',
    icon: '📋',
    fields: ['Date', 'Category', 'Amount', 'Description', 'Receipt'],
    format: 'pdf',
  },
  {
    id: 'monthly-summary',
    name: 'Monthly Summary',
    description: 'Month-by-month breakdown with trends',
    icon: '📊',
    fields: ['Month', 'Total', 'Category Breakdown', 'Avg/Day'],
    format: 'xlsx',
  },
  {
    id: 'category-analysis',
    name: 'Category Analysis',
    description: 'Deep dive into spending patterns by category',
    icon: '📈',
    fields: ['Category', 'Total', 'Count', 'Average', '% of Total'],
    format: 'csv',
  },
  {
    id: 'full-export',
    name: 'Full Export',
    description: 'Complete data export with all fields',
    icon: '💾',
    fields: ['All Fields', 'Timestamps', 'IDs', 'Metadata'],
    format: 'csv',
  },
];

const CLOUD_PROVIDERS = [
  { id: 'google-sheets', name: 'Google Sheets', icon: '📊', color: 'green' },
  { id: 'dropbox', name: 'Dropbox', icon: '📦', color: 'blue' },
  { id: 'onedrive', name: 'OneDrive', icon: '☁️', color: 'blue' },
  { id: 'email', name: 'Email', icon: '📧', color: 'purple' },
];

export default function CloudExportHub({
  expenses,
  isOpen,
  onClose,
}: CloudExportHubProps) {
  const [activeTab, setActiveTab] = useState<'export' | 'history' | 'schedule' | 'share'>('export');
  const [selectedTemplate, setSelectedTemplate] = useState<ExportTemplate>('monthly-summary');
  const [selectedProvider, setSelectedProvider] = useState<CloudProvider>('google-sheets');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);

  // Mock data for demonstration
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([
    {
      id: '1',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      template: 'monthly-summary',
      provider: 'google-sheets',
      recordCount: 45,
      totalAmount: 2345.67,
      status: 'success',
      destination: 'My Drive/Expenses/October 2025',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
      template: 'tax-report',
      provider: 'email',
      recordCount: 120,
      totalAmount: 5678.90,
      status: 'success',
      destination: 'accountant@example.com',
    },
  ]);

  const [cloudIntegrations, setCloudIntegrations] = useState<CloudIntegration[]>([
    { provider: 'google-sheets', connected: true, lastSync: new Date(Date.now() - 3600000).toISOString(), accountEmail: 'user@gmail.com' },
    { provider: 'dropbox', connected: false },
    { provider: 'onedrive', connected: true, lastSync: new Date(Date.now() - 7200000).toISOString(), accountEmail: 'user@outlook.com' },
    { provider: 'email', connected: true, accountEmail: 'user@example.com' },
  ]);

  const [scheduledExports, setScheduledExports] = useState<ScheduledExport[]>([
    {
      id: '1',
      template: 'monthly-summary',
      frequency: 'monthly',
      provider: 'google-sheets',
      destination: 'My Drive/Expenses',
      enabled: true,
      nextRun: new Date(Date.now() + 604800000).toISOString(),
    },
  ]);

  const [shareableLinks, setShareableLinks] = useState<ShareableLink[]>([
    {
      id: '1',
      url: 'https://expenses.app/share/abc123def',
      expiresAt: new Date(Date.now() + 604800000).toISOString(),
      viewCount: 5,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ]);

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);

    // Simulate export process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setExportProgress(i);
    }

    // Add to history
    const newExport: ExportHistory = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      template: selectedTemplate,
      provider: selectedProvider,
      recordCount: expenses.length,
      totalAmount: expenses.reduce((sum, exp) => sum + exp.amount, 0),
      status: 'success',
      destination: selectedProvider === 'email' ? emailRecipients : 'Cloud Storage',
    };

    setExportHistory([newExport, ...exportHistory]);
    setIsExporting(false);
    setExportProgress(0);

    alert(`✅ Successfully exported to ${selectedProvider}!`);
  };

  const handleGenerateShareLink = () => {
    const newLink: ShareableLink = {
      id: Date.now().toString(),
      url: `https://expenses.app/share/${Math.random().toString(36).substr(2, 9)}`,
      expiresAt: new Date(Date.now() + 604800000).toISOString(),
      viewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setShareableLinks([newLink, ...shareableLinks]);
    alert('✅ Shareable link generated!');
  };

  const handleToggleIntegration = (provider: CloudProvider) => {
    setCloudIntegrations(integrations =>
      integrations.map(int =>
        int.provider === provider
          ? { ...int, connected: !int.connected, lastSync: !int.connected ? new Date().toISOString() : undefined }
          : int
      )
    );
  };

  if (!isOpen) return null;

  const template = EXPORT_TEMPLATES.find(t => t.id === selectedTemplate);
  const integration = cloudIntegrations.find(i => i.provider === selectedProvider);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modern Header with Gradient */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold flex items-center gap-3">
                ☁️ Cloud Export Hub
              </h2>
              <p className="text-indigo-100 text-sm mt-1">
                Export, share, and sync your expense data everywhere
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:text-indigo-100 transition-colors"
              disabled={isExporting}
            >
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mt-4">
            {(['export', 'history', 'schedule', 'share'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-indigo-500 bg-opacity-30 text-white hover:bg-opacity-50'
                }`}
              >
                {tab === 'export' && '🚀 Export'}
                {tab === 'history' && '📜 History'}
                {tab === 'schedule' && '⏰ Auto-Backup'}
                {tab === 'share' && '🔗 Share'}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* EXPORT TAB */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              {/* Template Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Choose Export Template</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {EXPORT_TEMPLATES.map(temp => (
                    <button
                      key={temp.id}
                      onClick={() => setSelectedTemplate(temp.id)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedTemplate === temp.id
                          ? 'border-indigo-600 bg-indigo-50 shadow-md'
                          : 'border-gray-200 hover:border-indigo-300 hover:shadow'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-3xl">{temp.icon}</span>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{temp.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{temp.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className="text-xs bg-gray-100 px-2 py-1 rounded">{temp.format.toUpperCase()}</span>
                            <span className="text-xs text-gray-500">{temp.fields.length} fields</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Provider Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Export Destination</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {CLOUD_PROVIDERS.map(provider => {
                    const isConnected = cloudIntegrations.find(i => i.provider === provider.id as CloudProvider)?.connected;
                    return (
                      <button
                        key={provider.id}
                        onClick={() => setSelectedProvider(provider.id as CloudProvider)}
                        disabled={!isConnected}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          selectedProvider === provider.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : isConnected
                            ? 'border-gray-200 hover:border-indigo-300'
                            : 'border-gray-200 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="text-3xl mb-2">{provider.icon}</div>
                        <div className="font-medium text-sm">{provider.name}</div>
                        {!isConnected && (
                          <div className="text-xs text-red-600 mt-1">Not connected</div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Email-specific fields */}
              {selectedProvider === 'email' && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipients (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={emailRecipients}
                      onChange={e => setEmailRecipients(e.target.value)}
                      placeholder="email@example.com, another@example.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Message (Optional)
                    </label>
                    <textarea
                      value={customMessage}
                      onChange={e => setCustomMessage(e.target.value)}
                      placeholder="Add a personal message..."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    />
                  </div>
                </div>
              )}

              {/* Export Summary */}
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-5 border border-indigo-200">
                <h4 className="font-semibold text-indigo-900 mb-3">Export Summary</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-indigo-700">Template</div>
                    <div className="font-semibold text-indigo-900">{template?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-indigo-700">Destination</div>
                    <div className="font-semibold text-indigo-900">{CLOUD_PROVIDERS.find(p => p.id === selectedProvider)?.name}</div>
                  </div>
                  <div>
                    <div className="text-sm text-indigo-700">Records</div>
                    <div className="font-semibold text-indigo-900">{expenses.length} expenses</div>
                  </div>
                  <div>
                    <div className="text-sm text-indigo-700">Total Amount</div>
                    <div className="font-semibold text-indigo-900">
                      {formatCurrency(expenses.reduce((sum, exp) => sum + exp.amount, 0))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Progress */}
              {isExporting && (
                <div className="bg-white border-2 border-indigo-300 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Exporting...</span>
                    <span className="text-sm font-bold text-indigo-600">{exportProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 transition-all duration-300"
                      style={{ width: `${exportProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* HISTORY TAB */}
          {activeTab === 'history' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Export History</h3>
              <div className="space-y-3">
                {exportHistory.map(item => (
                  <div key={item.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">
                            {item.provider === 'google-sheets' && '📊'}
                            {item.provider === 'email' && '📧'}
                            {item.provider === 'dropbox' && '📦'}
                            {item.provider === 'onedrive' && '☁️'}
                          </span>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {EXPORT_TEMPLATES.find(t => t.id === item.template)?.name}
                            </h4>
                            <p className="text-sm text-gray-600">{new Date(item.timestamp).toLocaleString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-4 text-sm">
                          <span className="text-gray-600">{item.recordCount} records</span>
                          <span className="text-gray-600">{formatCurrency(item.totalAmount)}</span>
                          <span className="text-gray-600">→ {item.destination}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        item.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {item.status === 'success' && '✓ Success'}
                        {item.status === 'pending' && '⏳ Pending'}
                        {item.status === 'failed' && '✗ Failed'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SCHEDULE TAB */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Automatic Backups</h3>
                <p className="text-sm text-gray-600 mb-4">Schedule recurring exports to keep your data backed up automatically</p>

                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium">
                  ➕ Add New Schedule
                </button>
              </div>

              <div className="space-y-3">
                {scheduledExports.map(schedule => (
                  <div key={schedule.id} className="bg-white border-2 border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{EXPORT_TEMPLATES.find(t => t.id === schedule.template)?.icon}</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {EXPORT_TEMPLATES.find(t => t.id === schedule.template)?.name}
                            </h4>
                            <p className="text-sm text-gray-600">
                              Every {schedule.frequency} → {CLOUD_PROVIDERS.find(p => p.id === schedule.provider)?.name}
                            </p>
                          </div>
                        </div>
                        {schedule.nextRun && (
                          <div className="text-sm text-gray-600">
                            Next run: {new Date(schedule.nextRun).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={schedule.enabled}
                          onChange={() => {
                            setScheduledExports(schedules =>
                              schedules.map(s =>
                                s.id === schedule.id ? { ...s, enabled: !s.enabled } : s
                              )
                            );
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                      </label>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cloud Integrations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Cloud Integrations</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {cloudIntegrations.map(integration => {
                    const provider = CLOUD_PROVIDERS.find(p => p.id === integration.provider);
                    return (
                      <div key={integration.provider} className="bg-white border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="text-2xl">{provider?.icon}</span>
                            <div>
                              <h4 className="font-medium text-gray-900">{provider?.name}</h4>
                              {integration.connected && integration.accountEmail && (
                                <p className="text-xs text-gray-600">{integration.accountEmail}</p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={() => handleToggleIntegration(integration.provider)}
                            className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                              integration.connected
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {integration.connected ? '✓ Connected' : 'Connect'}
                          </button>
                        </div>
                        {integration.connected && integration.lastSync && (
                          <div className="text-xs text-gray-500">
                            Last sync: {new Date(integration.lastSync).toLocaleString()}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SHARE TAB */}
          {activeTab === 'share' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Share Your Data</h3>
                <p className="text-sm text-gray-600 mb-4">Create secure, temporary links to share your expense reports</p>

                <button
                  onClick={handleGenerateShareLink}
                  className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium"
                >
                  🔗 Generate Shareable Link
                </button>
              </div>

              <div className="space-y-3">
                {shareableLinks.map(link => (
                  <div key={link.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">🔗</span>
                          <div>
                            <h4 className="font-semibold text-gray-900">Shareable Link</h4>
                            <p className="text-xs text-gray-600">Created {new Date(link.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="bg-white border border-indigo-300 rounded px-3 py-2 text-sm text-indigo-600 font-mono break-all">
                          {link.url}
                        </div>
                      </div>
                      <button className="ml-3 p-2 hover:bg-indigo-100 rounded transition-colors">
                        📋
                      </button>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>👁️ {link.viewCount} views</span>
                      <span>⏰ Expires {new Date(link.expiresAt).toLocaleDateString()}</span>
                    </div>

                    {/* QR Code Placeholder */}
                    <div className="mt-3 pt-3 border-t border-indigo-200">
                      <div className="flex items-center gap-3">
                        <div className="w-24 h-24 bg-white border-2 border-indigo-300 rounded-lg flex items-center justify-center text-4xl">
                          📱
                        </div>
                        <div className="flex-1">
                          <h5 className="font-medium text-gray-900 mb-1">QR Code</h5>
                          <p className="text-xs text-gray-600">Scan to view on mobile device</p>
                          <button className="mt-2 text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                            Download QR Code
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {activeTab === 'export' && (
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {integration?.connected ? (
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Connected to {CLOUD_PROVIDERS.find(p => p.id === selectedProvider)?.name}
                </span>
              ) : (
                <span className="text-red-600">Not connected - Please connect in Auto-Backup tab</span>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                disabled={isExporting}
                className="px-5 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700 disabled:opacity-50"
              >
                Close
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting || !integration?.connected || (selectedProvider === 'email' && !emailRecipients)}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isExporting ? (
                  <>
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    Export to Cloud
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
