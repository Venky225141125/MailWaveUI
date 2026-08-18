"use client";

import {
  RichTextEditor as VeRichTextEditor,
  type RichTextEditorFeatures,
  type StandardToolbarItem,
} from "ve-rich-text-editor";
import "ve-rich-text-editor/styles.css";
import { useTheme } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";

const EDITOR_FEATURES: RichTextEditorFeatures = {
  bold: true,
  italic: true,
  underline: true,
  strike: true,
  code: true,
  superscript: true,
  subscript: true,
  clearFormatting: true,
  headings: { levels: [1, 2, 3, 4] },
  paragraph: true,
  fontFamily: true,
  fontSize: true,
  textColor: true,
  highlight: true,
  textAlign: true,
  blockquote: true,
  codeBlock: true,
  horizontalRule: true,
  bulletList: true,
  orderedList: true,
  taskList: true,
  links: true,
  images: { allowBase64: true },
  tables: { resizable: true },
  youtube: true,
  emoji: true,
  history: true,
  placeholder: true,
  characterCount: true,
  bubbleMenu: true,
};

const EDITOR_TOOLBAR: StandardToolbarItem[][] = [
  ["undo", "redo"],
  ["heading", "fontFamily", "fontSize"],
  ["bold", "italic", "underline", "strike", "code", "clearFormatting"],
  ["textColor", "highlight"],
  ["alignLeft", "alignCenter", "alignRight", "alignJustify"],
  ["bulletList", "orderedList", "taskList"],
  ["blockquote", "codeBlock", "horizontalRule"],
  ["link", "image", "table", "youtube", "emoji"],
  ["sourceCode", "fullscreen"],
];

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  minHeight?: number;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write something beautiful…",
  className,
  disabled,
  minHeight = 320,
}: RichTextEditorProps) {
  const { theme } = useTheme();

  return (
    <VeRichTextEditor
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      editable={!disabled}
      features={EDITOR_FEATURES}
      toolbar={EDITOR_TOOLBAR}
      stickyToolbar
      bubbleMenu
      showStats
      dark={theme === "dark"}
      ariaLabel="Email body"
      theme={{
        primaryColor: "var(--primary)",
        primaryHoverColor: "var(--brand-hover, var(--primary))",
        borderRadius: "0.75rem",
      }}
      style={{ minHeight }}
      className={cn("mw-rich-text-editor w-full overflow-hidden", className)}
    />
  );
}
