import MonacoEditor, { useMonaco } from '@monaco-editor/react';
import { useEffect } from 'react';
import styles from './CodeEditor.module.css';

interface Props {
  language: string;
  value: string;
  onChange: (value: string) => void;
}

const LANGUAGE_MAP: Record<string, string> = {
  python: 'python',
  typescript: 'typescript',
  javascript: 'javascript',
  cpp: 'cpp',
  java: 'java',
  go: 'go',
  rust: 'rust',
};

const EXT_MAP: Record<string, string> = {
  python: 'py',
  typescript: 'ts',
  javascript: 'js',
  cpp: 'cpp',
  java: 'java',
  go: 'go',
  rust: 'rs',
};

/** Custom light theme matching the CloudLab indigo/slate palette */
const CLOUDLAB_THEME = {
  base: 'vs' as const,
  inherit: true,
  rules: [
    // Comments — slate muted
    { token: 'comment',           foreground: '94a3b8', fontStyle: 'italic' },
    { token: 'comment.line',      foreground: '94a3b8', fontStyle: 'italic' },
    { token: 'comment.block',     foreground: '94a3b8', fontStyle: 'italic' },

    // Keywords — indigo (accent)
    { token: 'keyword',           foreground: '4f46e5', fontStyle: 'bold' },
    { token: 'keyword.control',   foreground: '4f46e5', fontStyle: 'bold' },
    { token: 'storage',           foreground: '4f46e5', fontStyle: 'bold' },
    { token: 'storage.type',      foreground: '4f46e5' },

    // Strings — green (success)
    { token: 'string',            foreground: '15803d' },
    { token: 'string.escape',     foreground: '0891b2' },

    // Numbers — amber
    { token: 'number',            foreground: 'b45309' },
    { token: 'number.float',      foreground: 'b45309' },

    // Functions / types — cyan
    { token: 'entity.name.function', foreground: '0771c5' },
    { token: 'support.function',      foreground: '0771c5' },
    { token: 'entity.name.type',      foreground: '0891b2' },
    { token: 'support.type',          foreground: '0891b2' },
    { token: 'support.class',         foreground: '0891b2' },

    // Variables
    { token: 'variable',           foreground: '0f172a' },
    { token: 'variable.parameter', foreground: '475569' },

    // Operators / punctuation
    { token: 'operator',           foreground: '4f46e5' },
    { token: 'delimiter',          foreground: '64748b' },

    // Tags (HTML/JSX)
    { token: 'tag',                foreground: '4f46e5' },
    { token: 'attribute.name',     foreground: '0891b2' },
    { token: 'attribute.value',    foreground: '15803d' },

    // Decorators / annotations
    { token: 'meta',               foreground: 'a855f7' },
    { token: 'annotation',         foreground: 'a855f7' },
  ],
  colors: {
    // Core editor
    'editor.background':                    '#ffffff',
    'editor.foreground':                    '#0f172a',

    // Line number gutter
    'editorLineNumber.foreground':          '#94a3b8',
    'editorLineNumber.activeForeground':    '#4f46e5',

    // Cursor
    'editorCursor.foreground':              '#4f46e5',

    // Selection
    'editor.selectionBackground':           '#c7d2fe',
    'editor.inactiveSelectionBackground':   '#e0e7ff',

    // Current line highlight
    'editor.lineHighlightBackground':       '#f1f5f9',
    'editor.lineHighlightBorder':           '#e2e8f0',

    // Matching bracket
    'editorBracketMatch.background':        '#e0e7ff',
    'editorBracketMatch.border':            '#4f46e5',

    // Find/Search highlight
    'editor.findMatchBackground':           '#fde68a',
    'editor.findMatchHighlightBackground':  '#fef9c3',

    // Scrollbar
    'scrollbarSlider.background':           '#e2e8f080',
    'scrollbarSlider.hoverBackground':      '#cbd5e1',
    'scrollbarSlider.activeBackground':     '#94a3b8',

    // Minimap
    'minimap.background':                   '#f8fafc',

    // Whitespace / indent guides
    'editorIndentGuide.background':         '#e2e8f0',
    'editorIndentGuide.activeBackground':   '#c7d2fe',

    // Widget (hover, autocomplete)
    'editorWidget.background':              '#ffffff',
    'editorWidget.border':                  '#e2e8f0',
    'editorSuggestWidget.background':       '#ffffff',
    'editorSuggestWidget.border':           '#e2e8f0',
    'editorSuggestWidget.selectedBackground':'#eef2ff',
    'editorHoverWidget.background':         '#ffffff',
    'editorHoverWidget.border':             '#e2e8f0',

    // Ruler & overview
    'editorRuler.foreground':               '#e2e8f0',
    'editorOverviewRuler.border':           '#e2e8f0',
  },
};

export default function CodeEditor({ language, value, onChange }: Props) {
  const monacoLang = LANGUAGE_MAP[language] ?? 'plaintext';
  const ext = EXT_MAP[language] ?? 'txt';
  const monaco = useMonaco();

  useEffect(() => {
    if (!monaco) return;
    monaco.editor.defineTheme('cloudlab-light', CLOUDLAB_THEME);
    monaco.editor.setTheme('cloudlab-light');
  }, [monaco]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.tabs}>
          <div className={styles.tab}>
            <span className={styles.tabIcon}>📄</span>
            <span>main.{ext}</span>
          </div>
        </div>
        <div className={styles.meta}>
          <span className={styles.langBadge}>{monacoLang}</span>
        </div>
      </div>

      <div className={styles.editor}>
        <MonacoEditor
          height="100%"
          width="100%"
          language={monacoLang}
          value={value}
          theme="cloudlab-light"
          onChange={(v) => onChange(v ?? '')}
          options={{
            fontSize: 14,
            fontFamily: '"JetBrains Mono", "Fira Code", Menlo, monospace',
            fontLigatures: true,
            minimap: { enabled: true, scale: 0.8 },
            smoothScrolling: true,
            cursorBlinking: 'phase',
            cursorSmoothCaretAnimation: 'on',
            lineHeight: 22,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            renderLineHighlight: 'line',
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            tabSize: 4,
            overviewRulerLanes: 0,
            renderWhitespace: 'none',
          }}
        />
      </div>
    </div>
  );
}
