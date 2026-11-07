import React, { useState } from 'react';
import { X, Download, Copy, Check, FileCode, Folder, ChevronRight, Terminal } from 'lucide-react';
import JSZip from 'jszip';
import { GODOT_PROJECT_FILES, GodotProjectFile } from '../godot/godotFiles';

interface GodotSuiteModalProps {
  onClose: () => void;
}

export const GodotSuiteModal: React.FC<GodotSuiteModalProps> = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState<GodotProjectFile>(GODOT_PROJECT_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    try {
      const zip = new JSZip();
      GODOT_PROJECT_FILES.forEach(file => {
        zip.file(file.path, file.content);
      });
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'operacion_vertice_godot4_project.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create zip:', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-50 p-6 font-tactical select-none">
      <div className="w-full max-w-6xl h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wider">CENTRO DE DESARROLLO GODOT 4.3</h2>
              <span className="text-xs text-slate-400">Arquitectura completa de scripts GDScript, escenas, shaders y proyecto</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownloadZip}
              disabled={isZipping}
              className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs px-4 py-2 rounded-lg transition-colors shadow-lg"
            >
              <Download className="w-4 h-4" />
              <span>{isZipping ? 'EMPAQUETANDO .ZIP...' : 'DESCARGAR PROYECTO GODOT 4 (.ZIP)'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content split */}
        <div className="flex-1 flex overflow-hidden">
          {/* File Explorer Tree */}
          <div className="w-80 border-r border-slate-800 bg-slate-950/40 p-4 flex flex-col gap-2 overflow-y-auto">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Folder className="w-3.5 h-3.5 text-cyan-400" />
              <span>ARCHIVOS DEL PROYECTO ({GODOT_PROJECT_FILES.length})</span>
            </span>
            <div className="flex flex-col gap-1">
              {GODOT_PROJECT_FILES.map((file) => {
                const isSelected = selectedFile.path === file.path;
                return (
                  <button
                    key={file.path}
                    onClick={() => setSelectedFile(file)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 font-bold'
                        : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <FileCode className="w-4 h-4 shrink-0 text-slate-500" />
                      <span className="truncate font-mono">{file.path}</span>
                    </div>
                    {isSelected && <ChevronRight className="w-3.5 h-3.5 shrink-0 text-cyan-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Code Viewer */}
          <div className="flex-1 flex flex-col bg-slate-950/80 overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800/80 px-6 py-3 bg-slate-900/40">
              <div className="flex flex-col">
                <span className="text-sm font-bold font-mono text-cyan-400">{selectedFile.path}</span>
                <span className="text-xs text-slate-400">{selectedFile.description}</span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡COPIADO!' : 'COPIAR CÓDIGO'}</span>
              </button>
            </div>
            <div className="flex-1 p-6 overflow-auto">
              <pre className="font-mono text-xs leading-relaxed text-slate-300 whitespace-pre">
                {selectedFile.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
