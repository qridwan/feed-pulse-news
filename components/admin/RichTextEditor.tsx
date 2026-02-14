"use client";

import { useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Underline from "@tiptap/extension-underline";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  disabled?: boolean;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Write content…",
  minHeight = "12rem",
  disabled,
}: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
      }),
      Link.configure({ openOnClick: false }),
      Underline,
    ],
    content: value || "",
    editable: !disabled,
    editorProps: {
      attributes: {
        class: "prose prose-sm max-w-none focus:outline-none min-h-[8rem] px-4 py-3",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if (value !== current && (value || current !== "<p></p>")) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href;
    const url = globalThis.prompt("URL", previous);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  if (!editor) {
    return (
      <div
        className="rounded-xl border border-neutral-300 bg-white animate-pulse"
        style={{ minHeight }}
      />
    );
  }

  return (
    <div
      className="rounded-xl border border-neutral-300 bg-white overflow-hidden"
      style={{ minHeight }}
    >
      <div className="flex flex-wrap gap-1 border-b border-neutral-200 bg-neutral-50 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "rounded bg-neutral-200 px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm hover:bg-neutral-100"}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "rounded bg-neutral-200 px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm hover:bg-neutral-100"}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "rounded bg-neutral-200 px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm hover:bg-neutral-100"}
        >
          Underline
        </button>
        <span className="text-neutral-300">|</span>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "rounded bg-neutral-200 px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm hover:bg-neutral-100"}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "rounded bg-neutral-200 px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm hover:bg-neutral-100"}
        >
          H3
        </button>
        <span className="text-neutral-300">|</span>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "rounded bg-neutral-200 px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm hover:bg-neutral-100"}
        >
          Bullet list
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "rounded bg-neutral-200 px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm hover:bg-neutral-100"}
        >
          Numbered list
        </button>
        <span className="text-neutral-300">|</span>
        <button
          type="button"
          onClick={setLink}
          className={editor.isActive("link") ? "rounded bg-neutral-200 px-2 py-1 text-sm" : "rounded px-2 py-1 text-sm hover:bg-neutral-100"}
        >
          Link
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
