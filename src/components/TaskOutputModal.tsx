import React, { useState, useMemo } from 'react';
import { Task } from '../types';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  FileText,
  Database,
  Code2,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldCheck,
  Sparkles,
  Terminal,
  Laptop,
  Smartphone,
  WrapText,
  User,
  Bot,
  ListChecks,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { AgentAvatar } from './AgentAvatar';

interface TaskOutputModalProps {
  task: Task | null;
  onClose: () => void;
  onApprove?: (taskId: string) => Promise<void>;
  onRevise?: (taskId: string, feedback: string) => Promise<void>;
  onClarify?: (taskId: string, answer: string) => Promise<void>;
}

export interface DocumentSection {
  id: string;
  title: string;
  type: 'TEXT' | 'CODE';
  language: string;
  isHtml: boolean;
  content: string;
}

// Deteksi bahasa dan tipe berkas
export function detectFileMeta(name: string, content: string): { lang: string; isHtml: boolean; ext: string } {
  const lower = name.toLowerCase();
  if (lower.endsWith('.html') || lower.endsWith('.htm') || content.includes('<!doctype html') || content.includes('<html')) {
    return { lang: 'html', isHtml: true, ext: 'html' };
  }
  if (lower.endsWith('.sql') || content.toUpperCase().includes('CREATE TABLE') || content.toUpperCase().includes('SELECT ')) {
    return { lang: 'sql', isHtml: false, ext: 'sql' };
  }
  if (lower.endsWith('.json') || (content.trim().startsWith('{') && content.trim().endsWith('}'))) {
    return { lang: 'json', isHtml: false, ext: 'json' };
  }
  if (lower.endsWith('.yaml') || lower.endsWith('.yml')) {
    return { lang: 'yaml', isHtml: false, ext: 'yaml' };
  }
  if (lower.endsWith('.ts') || lower.endsWith('.tsx')) {
    return { lang: 'typescript', isHtml: false, ext: 'ts' };
  }
  if (lower.endsWith('.js') || lower.endsWith('.jsx')) {
    return { lang: 'javascript', isHtml: false, ext: 'js' };
  }
  if (lower.endsWith('.css')) {
    return { lang: 'css', isHtml: false, ext: 'css' };
  }
  if (lower.endsWith('.md')) {
    return { lang: 'markdown', isHtml: false, ext: 'md' };
  }
  return { lang: 'text', isHtml: false, ext: 'txt' };
}

export function extractHtmlSnippet(content: string): string {
  const match = content.match(/<!doctype html[\s\S]*?<\/html>/i) || content.match(/<html[\s\S]*?<\/html>/i);
  if (match) {
    return match[0].replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\t/g, '\t');
  }
  return content;
}

// Parser memecah keluaran AI menjadi bagian-bagian terurut kebawah
export function parseAiDocument(rawText: string | null | undefined): DocumentSection[] {
  if (!rawText || !rawText.trim()) return [];

  const text = rawText.trim();
  // Pisahkan berdasarkan header berkas: ### nama_berkas (TIPE) menggunakan multiline flag m standar JS
  const parts = text.split(/^###\s+([^\n]+)$/m);

  if (parts.length > 1) {
    const sections: DocumentSection[] = [];
    const intro = parts[0].trim();

    if (intro) {
      sections.push({
        id: 'sec-intro',
        title: 'Ringkasan & Penjelasan Solusi',
        type: 'TEXT',
        language: 'markdown',
        isHtml: false,
        content: intro,
      });
    }

    for (let i = 1; i < parts.length; i += 2) {
      const headerRaw = (parts[i] || '').trim();
      const bodyRaw = (parts[i + 1] || '').trim();

      // Bersihkan tipe dari nama berkas, contoh: "index.html (CODE)" -> "index.html"
      const nameMatch = headerRaw.match(/^([^\(\)]+)(?:\s*\(([^\)]+)\))?$/);
      const fileName = nameMatch ? nameMatch[1].trim() : headerRaw;
      const fileTypeTag = nameMatch && nameMatch[2] ? nameMatch[2].trim().toUpperCase() : 'FILE';

      const { lang, isHtml } = detectFileMeta(fileName, bodyRaw);
      const isCode = fileTypeTag === 'CODE' || isHtml || ['sql', 'json', 'typescript', 'javascript', 'css', 'yaml'].includes(lang);

      sections.push({
        id: `sec-${i}`,
        title: fileName,
        type: isCode ? 'CODE' : 'TEXT',
        language: lang,
        isHtml,
        content: bodyRaw,
      });
    }

    return sections;
  }

  // Jika teks tunggal tanpa ###, cek apakah blok kode atau teks
  const { lang, isHtml } = detectFileMeta('Jawaban AI', text);
  return [
    {
      id: 'sec-main',
      title: 'Hasil Jawaban AI',
      type: isHtml || lang !== 'text' ? 'CODE' : 'TEXT',
      language: lang,
      isHtml,
      content: text,
    },
  ];
}

// Komponen perender format Markdown sederhana & elegan (Headings, bold, list, code inline)
const MarkdownViewer: React.FC<{ content: string }> = ({ content }) => {
  const paragraphs = useMemo(() => {
    return content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
  }, [content]);

  // Fungsi pembantu format inline (bold, code, links)
  const formatInline = (text: string) => {
    const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code
            key={index}
            className="px-1.5 py-0.5 mx-0.5 rounded-md bg-slate-800 text-cyan-300 font-mono text-xs border border-slate-700/60"
          >
            {part.slice(1, -1)}
          </code>
        );
      }
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-3.5 text-slate-200 text-sm leading-relaxed break-words font-sans">
      {paragraphs.map((p, idx) => {
        const trimmed = p.trim();

        // Horizontal divider
        if (trimmed === '---') {
          return <hr key={idx} className="border-slate-800 my-4" />;
        }

        // Fenced code block in markdown
        if (trimmed.startsWith('```') && trimmed.endsWith('```')) {
          const codeContent = trimmed.replace(/^```[a-zA-Z]*\n?/, '').replace(/```$/, '');
          return (
            <pre key={idx} className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto my-2 shadow-inner">
              <code>{codeContent}</code>
            </pre>
          );
        }

        // Blockquote (> text)
        if (trimmed.startsWith('>')) {
          const quoteLines = trimmed.split('\n').map(l => l.replace(/^>\s*/, '')).join('\n');
          return (
            <blockquote key={idx} className="border-l-4 border-cyan-500/80 bg-slate-900/60 px-4 py-2.5 rounded-r-2xl my-2 text-slate-200 text-xs sm:text-sm">
              {formatInline(quoteLines)}
            </blockquote>
          );
        }

        // Heading 3: ### Title
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="text-base font-bold text-white pt-2 pb-1 border-b border-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-4 rounded-full bg-cyan-400"></span>
              {trimmed.replace(/^###\s+/, '')}
            </h4>
          );
        }

        // Heading 2: ## Title
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="text-lg font-black text-white pt-3 pb-1 border-b border-slate-800 flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-indigo-400"></span>
              {trimmed.replace(/^##\s+/, '')}
            </h3>
          );
        }

        // List item (- atau * atau angka)
        const lines = trimmed.split('\n');
        const isList = lines.every((l) => /^\s*([*\-]|\d+\.)\s+/.test(l));

        if (isList) {
          return (
            <ul key={idx} className="space-y-1.5 pl-1 my-2">
              {lines.map((l, lIdx) => {
                const cleanText = l.replace(/^\s*([*\-]|\d+\.)\s+/, '');
                return (
                  <li key={lIdx} className="flex items-start gap-2.5 text-slate-300 text-xs sm:text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-2"></span>
                    <span className="leading-relaxed">{formatInline(cleanText)}</span>
                  </li>
                );
              })}
            </ul>
          );
        }

        // Regular paragraph
        return (
          <p key={idx} className="text-slate-300 leading-relaxed text-xs sm:text-sm">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};

// Komponen Blok Kode Gaya AI (ChatGPT / Claude / Cursor) dengan Word Wrap Kebawah
const AiCodeBlock: React.FC<{
  section: DocumentSection;
  onCopy: (id: string, text: string) => void;
  isCopied: boolean;
  onDownload: (title: string, text: string) => void;
}> = ({ section, onCopy, isCopied, onDownload }) => {
  const [isWrapEnabled, setIsWrapEnabled] = useState<boolean>(true); // Default ON agar tidak scroll ke samping
  const [showLivePreview, setShowLivePreview] = useState<boolean>(false);
  const [previewViewport, setPreviewViewport] = useState<'DESKTOP' | 'MOBILE'>('DESKTOP');

  const lineCount = useMemo(() => {
    return section.content.split('\n').length;
  }, [section.content]);

  return (
    <div className="rounded-2xl border border-slate-800/90 bg-[#060a14] overflow-hidden shadow-lg transition-all my-3">
      {/* Header Bar Kode (Sleek Dark AI Code Header) */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-slate-950 border-b border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <Terminal className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span className="font-mono font-bold text-slate-200 truncate text-[11px] sm:text-xs">
            {section.title}
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-slate-800 uppercase">
            {section.language}
          </span>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            {lineCount} baris
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Tombol Pratinjau Langsung jika HTML */}
          {section.isHtml && (
            <button
              onClick={() => setShowLivePreview(!showLivePreview)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                showLivePreview
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 border border-slate-800 text-cyan-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {showLivePreview ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3 text-cyan-400" />}
              <span>{showLivePreview ? 'Tutup Preview' : 'Pratinjau Web'}</span>
            </button>
          )}

          {/* Toggle Word Wrap */}
          <button
            onClick={() => setIsWrapEnabled(!isWrapEnabled)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium flex items-center gap-1 border transition-colors ${
              isWrapEnabled
                ? 'bg-slate-900 border-slate-700 text-slate-300 hover:text-white'
                : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
            title={isWrapEnabled ? 'Word Wrap aktif (teks mengalir ke bawah)' : 'Aktifkan Word Wrap'}
          >
            <WrapText className="w-3 h-3 text-cyan-400" />
            <span className="hidden md:inline">{isWrapEnabled ? 'Wrap Aktif' : 'No Wrap'}</span>
          </button>

          {/* Tombol Salin Kode */}
          <button
            onClick={() => onCopy(section.id, section.content)}
            className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-1.5 text-[11px] font-semibold"
            title="Salin kode ini"
          >
            {isCopied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Tersalin</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-slate-400" />
                <span>Salin</span>
              </>
            )}
          </button>

          {/* Unduh Berkas */}
          <button
            onClick={() => onDownload(section.title, section.content)}
            className="p-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Unduh berkas"
          >
            <Download className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Live Web Sandbox Preview jika HTML Aktif */}
      {section.isHtml && showLivePreview && (
        <div className="border-b border-slate-800 bg-[#030712] p-3 sm:p-4 animate-fadeIn">
          <div className="flex items-center justify-between gap-3 mb-2 px-2 text-xs">
            <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-cyan-400" />
              Interactive Sandboxed Web Preview
            </span>
            <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setPreviewViewport('DESKTOP')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  previewViewport === 'DESKTOP' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Laptop className="w-3 h-3" />
                Desktop
              </button>
              <button
                onClick={() => setPreviewViewport('MOBILE')}
                className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                  previewViewport === 'MOBILE' ? 'bg-cyan-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Smartphone className="w-3 h-3" />
                Mobile
              </button>
            </div>
          </div>

          <div className="flex justify-center bg-slate-950/80 rounded-xl p-2 border border-slate-800/80">
            <div
              className={`transition-all duration-300 w-full overflow-hidden rounded-lg shadow-2xl border border-slate-800 bg-white ${
                previewViewport === 'MOBILE' ? 'max-w-[375px]' : 'w-full'
              }`}
            >
              <iframe
                title={`Live-Preview-${section.title}`}
                srcDoc={extractHtmlSnippet(section.content)}
                sandbox="allow-scripts allow-forms allow-modals"
                className="w-full h-[460px] border-0"
              />
            </div>
          </div>
        </div>
      )}

      {/* Area Tampilan Kode: MENGALIR KE BAWAH TANPA SCROLL SAMPING */}
      <div className="p-3.5 sm:p-5 text-xs sm:text-[13px] bg-[#040711] overflow-hidden">
        <pre
          className={`font-mono text-cyan-100 leading-relaxed select-text ${
            isWrapEnabled
              ? 'whitespace-pre-wrap break-words overflow-x-hidden'
              : 'whitespace-pre overflow-x-auto'
          }`}
        >
          <code>{section.content}</code>
        </pre>
      </div>
    </div>
  );
};

export const TaskOutputModal: React.FC<TaskOutputModalProps> = ({
  task,
  onClose,
  onApprove,
  onRevise,
  onClarify,
}) => {
  const [copiedSectionId, setCopiedSectionId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState<boolean>(false);
  const [isApproving, setIsApproving] = useState<boolean>(false);
  const [showReviseBox, setShowReviseBox] = useState<boolean>(false);
  const [reviseNotes, setReviseNotes] = useState<string>('');
  const [isSubmittingRevise, setIsSubmittingRevise] = useState<boolean>(false);
  const [showClarifyBox, setShowClarifyBox] = useState<boolean>(false);
  const [clarifyAnswer, setClarifyAnswer] = useState<string>('');
  const [isSubmittingClarify, setIsSubmittingClarify] = useState<boolean>(false);

  const handleClarifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onClarify || !clarifyAnswer.trim() || !task) return;
    try {
      setIsSubmittingClarify(true);
      await onClarify(task.id, clarifyAnswer.trim());
      setShowClarifyBox(false);
      setClarifyAnswer('');
      onClose();
    } catch (e: any) {
      alert(`Gagal mengirim klarifikasi: ${e.message}`);
    } finally {
      setIsSubmittingClarify(false);
    }
  };

  const sections = useMemo(() => {
    return parseAiDocument(task?.result);
  }, [task?.result]);

  if (!task) return null;

  const agentName = task.agent?.name || 'Staff AI';
  const roleName = task.agent?.role || 'Spesialis AI';

  const handleCopySection = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedSectionId(id);
    setTimeout(() => setCopiedSectionId(null), 2000);
  };

  const handleCopyAll = () => {
    if (!task.result) return;
    navigator.clipboard.writeText(task.result);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadFile = (title: string, content: string) => {
    const { ext } = detectFileMeta(title, content);
    const filename = title.includes('.') ? title : `${title.replace(/\s+/g, '_').toLowerCase()}.${ext}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleApproveClick = async () => {
    if (!onApprove) return;
    try {
      setIsApproving(true);
      await onApprove(task.id);
      onClose();
    } catch (e: any) {
      alert(`Gagal approve task: ${e.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleReviseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onRevise || !reviseNotes.trim()) return;
    try {
      setIsSubmittingRevise(true);
      await onRevise(task.id, reviseNotes);
      setShowReviseBox(false);
      setReviseNotes('');
      onClose();
    } catch (e: any) {
      alert(`Gagal mengirim revisi: ${e.message}`);
    } finally {
      setIsSubmittingRevise(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-xl p-2.5 sm:p-4 md:p-6 animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-800 bg-[#080d19] shadow-[0_25px_80px_rgba(0,0,0,0.95)] overflow-hidden">
        {/* ======================================================== */}
        {/* 1. TOP HEADER: MODAL TITLE & AGENT INFO                  */}
        {/* ======================================================== */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-7 py-3.5 sm:py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <AgentAvatar name={agentName} size={40} showStatus={true} status="WORKING" />

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-white flex items-center gap-1.5">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  {agentName}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">({roleName})</span>
                <span
                  className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                    task.status === 'DONE'
                      ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                      : task.status === 'BLOCKED'
                      ? 'bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse'
                      : task.status === 'REVIEW'
                      ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                      : 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                  }`}
                >
                  {task.status === 'DONE' ? '✓ SELESAI' : task.status === 'BLOCKED' ? '⚠ TERKENDALA (BUTUH KLARIFIKASI)' : task.status === 'REVIEW' ? '⚠ BUTUH REVIEW / KLARIFIKASI' : task.status}
                </span>
              </div>

              <h2 className="text-sm sm:text-base font-bold text-slate-200 truncate mt-0.5 tracking-tight" title={task.title}>
                {task.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Salin Semua Jawaban */}
            <button
              onClick={handleCopyAll}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-1.5 transition-all shadow-sm"
              title="Salin seluruh jawaban ke clipboard"
            >
              {copiedAll ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span className="hidden sm:inline">{copiedAll ? 'Tersalin!' : 'Salin Jawaban'}</span>
            </button>

            {/* Tombol Tutup */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-rose-950/40 hover:border-rose-800/40 transition-colors"
              title="Tutup (ESC)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. CHAT STREAM KEBAGIAN-BAGIAN KE BAWAH (SEPERTI AI)     */}
        {/* ======================================================== */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-7 md:p-8 flex flex-col gap-5 sm:gap-6 selection:bg-cyan-500/30">
          {/* A. BUBBLE USER / PROMPT TUGAS (SEPERTI PROMPT DI CHATGPT) */}
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/50 p-4 sm:p-5 flex flex-col gap-2.5 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <div className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <User className="w-3 h-3" />
              </div>
              <span className="text-white">Instruksi & Permintaan Tugas (Prompt)</span>
              {task.taskKey && (
                <span className="font-mono text-[10px] text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                  {task.taskKey}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-slate-200 font-sans leading-relaxed break-words pl-7">
              {task.description || task.title}
            </p>

            {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
              <div className="pl-7 pt-1 flex flex-wrap gap-1.5">
                {task.acceptanceCriteria.map((c, i) => (
                  <span
                    key={i}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                    <span>{c}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* BANNER KLARIFIKASI DARI OWNER JIKA TASK TERKENDALA / BUTUH INFO */}
          {(task.status === 'BLOCKED' || task.status === 'REVIEW' || (task.outputEnvelope?.open_questions && task.outputEnvelope.open_questions.length > 0)) && (
            <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/40 to-slate-900/90 p-4 sm:p-5 flex flex-col gap-3 shadow-lg animate-fadeIn">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs sm:text-sm">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-300">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span>{task.status === 'BLOCKED' ? 'Tugas Terkendala — Butuh Klarifikasi Owner' : 'Agen Membutuhkan Arahan / Klarifikasi Tambahan'}</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200 border border-amber-500/30 font-bold">
                  AKSI DIPERLUKAN
                </span>
              </div>

              <p className="text-xs text-slate-300">
                Agen <strong>{agentName}</strong> membutuhkan informasi tambahan berikut agar tugas dapat langsung berjalan kembali:
              </p>

              {task.outputEnvelope?.open_questions && task.outputEnvelope.open_questions.length > 0 && (
                <ul className="text-xs text-amber-200/90 list-disc list-inside space-y-1 bg-black/30 p-3 rounded-xl border border-amber-500/20 font-sans">
                  {task.outputEnvelope.open_questions.map((q: string, idx: number) => (
                    <li key={idx} className="leading-relaxed">{q}</li>
                  ))}
                </ul>
              )}

              {task.error && (
                <div className="text-xs text-rose-300 bg-rose-950/30 p-2.5 rounded-xl border border-rose-800/30 font-mono">
                  Kendala: {task.error}
                </div>
              )}

              {/* Formulir Klarifikasi Langsung di Modal */}
              <form onSubmit={handleClarifySubmit} className="flex flex-col gap-2.5 mt-1">
                <textarea
                  value={clarifyAnswer}
                  onChange={(e) => setClarifyAnswer(e.target.value)}
                  placeholder="Tuliskan klarifikasi, instruksi spesifik, atau data yang dibutuhkan agen di sini..."
                  rows={3}
                  required
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:outline-none focus:border-amber-400 font-sans resize-none shadow-inner"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmittingClarify || !clarifyAnswer.trim()}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all hover:scale-105 disabled:opacity-50 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isSubmittingClarify ? 'Mengirim & Menjalankan...' : 'Kirim Klarifikasi & Jalankan Lagi 🚀'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* B. AI RESPONSE STREAM: MENGALIR KE BAWAH ALAMI */}
          <div className="flex flex-col gap-4">
            {/* AI Assistant Indicator Header */}
            <div className="flex items-center justify-between gap-3 text-xs border-b border-slate-800/70 pb-2.5">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-white">Tanggapan Solusi dari {agentName}</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  • AI Enterprise Output
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-500">
                {Math.round((task.result?.length || 0) / 1024 * 10) / 10} KB • {sections.length} Bagian
              </div>
            </div>

            {/* Isi Tanggapan AI */}
            {sections.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
                <AlertTriangle className="w-10 h-10 text-amber-500/60" />
                <p className="text-sm font-sans font-medium text-slate-400">
                  Belum ada output hasil kerja untuk task ini.
                </p>
                <p className="text-xs text-slate-500 max-w-sm text-center">
                  Instruksi tugas sedang dalam antrean atau menunggu dependensi selesai dikerjakan oleh agent lain.
                </p>
              </div>
            ) : (
              sections.map((sec) => {
                if (sec.type === 'CODE') {
                  return (
                    <AiCodeBlock
                      key={sec.id}
                      section={sec}
                      onCopy={handleCopySection}
                      isCopied={copiedSectionId === sec.id}
                      onDownload={handleDownloadFile}
                    />
                  );
                }

                // Jika Tipe TEXT (Penjelasan Solusi / Markdown)
                return (
                  <div key={sec.id} className="py-2">
                    {/* Jika bukan intro dan memiliki judul spesifik, tampilkan header kecil */}
                    {sec.id !== 'sec-intro' && sec.title && (
                      <h4 className="text-sm font-bold text-cyan-300 font-mono mb-2 flex items-center gap-1.5">
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <span>{sec.title}</span>
                      </h4>
                    )}
                    <MarkdownViewer content={sec.content} />
                  </div>
                );
              })
            )}

            {/* C. KESIMPULAN & CHECKLIST KRITERIA PENERIMAAN (DI AKHIR JAWABAN) */}
            <div className="mt-4 rounded-2xl border border-slate-800/80 bg-slate-950/70 p-4 sm:p-5 flex flex-col gap-2.5">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-cyan-400" />
                Verifikasi Standar Kualitas & Kriteria Penerimaan:
              </span>
              <div className="flex flex-col gap-1.5">
                {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 ? (
                  task.acceptanceCriteria.map((c, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Seluruh kriteria arsitektur dan spesifikasi tugas telah dipenuhi oleh {agentName}.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 3. STICKY MODAL FOOTER: ACTION BUTTONS                   */}
        {/* ======================================================== */}
        <div className="px-5 sm:px-7 py-3.5 sm:py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400 font-mono">
            {task.finishedAt
              ? `Selesai: ${new Date(task.finishedAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`
              : 'Status Aktif'}
          </div>

          <div className="flex items-center gap-3">
            {task.status === 'REVIEW' && (
              <>
                <button
                  onClick={() => setShowReviseBox(!showReviseBox)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30 hover:bg-amber-500/25 flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Minta Revisi</span>
                </button>

                <button
                  onClick={handleApproveClick}
                  disabled={isApproving}
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 disabled:opacity-50"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isApproving ? 'Menyetujui...' : 'Setujui Hasil Kerja'}</span>
                </button>
              </>
            )}

            {task.status === 'DONE' && (
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3.5 py-1.5 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Hasil Sudah Disetujui & Terverifikasi</span>
              </div>
            )}
          </div>
        </div>

        {/* Inline Drawer Formulir Revisi */}
        {showReviseBox && (
          <div className="p-4 bg-slate-900 border-t border-slate-800 animate-fadeIn shrink-0">
            <form onSubmit={handleReviseSubmit} className="flex flex-col gap-2.5">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Catatan Revisi untuk {agentName}:
              </span>
              <textarea
                value={reviseNotes}
                onChange={(e) => setReviseNotes(e.target.value)}
                placeholder="Tuliskan bagian mana yang perlu diperbaiki atau disesuaikan..."
                rows={3}
                required
                className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white focus:outline-none focus:border-amber-500 font-sans"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowReviseBox(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingRevise}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmittingRevise ? 'Mengirim...' : 'Kirim Catatan Revisi'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskOutputModal;
