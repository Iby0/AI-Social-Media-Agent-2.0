import React, { useState } from 'react';
import { usePluginManager } from '../../hooks/usePluginManager';
import { PluginValidator } from '../../services/plugins/plugin-validator';
import {
  Upload,
  Code2,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  ShieldCheck,
  PlusCircle,
  Copy,
} from 'lucide-react';

const SAMPLE_CUSTOM_MANIFEST_TEMPLATE = `{
  "id": "custom-analytics-enhancer",
  "name": "Custom Content Analytics Enhancer",
  "version": "1.0.0",
  "author": "Local Developer",
  "description": "Calculates local viral scores based on media attachments and hashtag density.",
  "category": "analytics",
  "entryFile": "plugin.js",
  "icon": "BarChart3",
  "permissions": ["read_analytics", "read_storage"],
  "dependencies": [],
  "minAppVersion": "1.0.0",
  "enabled": false,
  "installedDate": "",
  "updatedDate": "",
  "checksum": "custom_sha256_e10a22"
}`;

export const PluginInstaller: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const { importManifestJson } = usePluginManager();
  const [manifestJson, setManifestJson] = useState<string>(SAMPLE_CUSTOM_MANIFEST_TEMPLATE);
  const [validationResult, setValidationResult] = useState<any | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleValidate = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const parsed = JSON.parse(manifestJson);
      const res = PluginValidator.validateManifest(parsed);
      setValidationResult(res);
      if (!res.isValid) {
        setErrorMsg(res.errors.join('; '));
      }
    } catch (err: any) {
      setErrorMsg(`JSON Parse Error: ${err.message}`);
      setValidationResult(null);
    }
  };

  const handleRegister = () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      importManifestJson(manifestJson);
      setSuccessMsg('Plugin manifest registered successfully to local registry!');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to register plugin.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setManifestJson(text);
        setErrorMsg(null);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6 max-w-3xl">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <PlusCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Local Manifest File Installer</h3>
            <p className="text-xs text-slate-500">
              Register custom offline plugins using JSON manifests directly without external servers.
            </p>
          </div>
        </div>

        <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 cursor-pointer transition-all">
          <Upload className="w-4 h-4 text-indigo-600" />
          <span>Upload JSON</span>
          <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-bold text-slate-700 flex items-center gap-1.5">
            <Code2 className="w-4 h-4 text-indigo-600" />
            <span>Plugin Manifest Specification (JSON)</span>
          </label>
          <button
            type="button"
            onClick={() => setManifestJson(SAMPLE_CUSTOM_MANIFEST_TEMPLATE)}
            className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1"
          >
            <Copy className="w-3 h-3" /> Load Sample Manifest
          </button>
        </div>

        <textarea
          value={manifestJson}
          onChange={(e) => {
            setManifestJson(e.target.value);
            setValidationResult(null);
            setErrorMsg(null);
          }}
          rows={12}
          className="w-full font-mono text-xs p-4 rounded-2xl border border-slate-300 bg-slate-900 text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {validationResult && validationResult.isValid && (
        <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-indigo-950">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>Validation Passed: Ready for Installation</span>
          </div>
          <p className="text-[11px] text-indigo-800">
            Plugin "{validationResult.manifest.name}" v{validationResult.manifest.version} matches semver specs and requests {validationResult.manifest.permissions.length} system permissions.
          </p>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={handleValidate}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all"
        >
          Validate Structure
        </button>

        <button
          type="button"
          onClick={handleRegister}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all"
        >
          Register & Save Manifest
        </button>
      </div>
    </div>
  );
};
