"use client";

import { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface TagSelectorProps {
  tags: Tag[];
  value: string[];
  onChange: (tagIds: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function TagSelector({
  tags,
  value,
  onChange,
  placeholder = "Select or type tags…",
  disabled,
}: TagSelectorProps) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = tags.filter((t) => value.includes(t.id));
  const available = tags.filter(
    (t) =>
      !value.includes(t.id) &&
      (input === "" || t.name.toLowerCase().includes(input.toLowerCase()))
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const add = (tagId: string) => {
    if (!value.includes(tagId)) onChange([...value, tagId]);
    setInput("");
    setOpen(false);
  };

  const remove = (tagId: string) => {
    onChange(value.filter((id) => id !== tagId));
  };

  return (
    <div ref={ref} className="relative space-y-2">
      <div className="flex flex-wrap gap-2 rounded-xl border border-neutral-300 bg-white p-2 min-h-[2.75rem]">
        {selected.map((tag) => (
          <span
            key={tag.id}
            className="inline-flex items-center gap-1 rounded-lg bg-neutral-100 px-2.5 py-1 text-sm text-neutral-800"
          >
            {tag.name}
            {!disabled && (
              <button
                type="button"
                onClick={() => remove(tag.id)}
                className="rounded hover:bg-neutral-200 p-0.5 leading-none"
                aria-label={`Remove ${tag.name}`}
              >
                ×
              </button>
            )}
          </span>
        ))}
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder : ""}
          disabled={disabled}
          className="flex-1 min-w-[8rem] border-0 bg-transparent px-2 py-1 text-sm placeholder:text-neutral-400 focus:outline-none"
        />
      </div>
      {open && available.length > 0 && (
        <ul
          className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
          role="listbox"
        >
          {available.slice(0, 20).map((tag) => (
            <li key={tag.id} role="option">
              <button
                type="button"
                onClick={() => add(tag.id)}
                className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50"
              >
                {tag.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
