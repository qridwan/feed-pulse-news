/**
 * Renders article HTML with prose styling. Content is from admin (Tiptap);
 * for production you may add a sanitizer (e.g. DOMPurify).
 */
export interface NewsContentProps {
  html: string;
  className?: string;
}

export function NewsContent({ html, className = "" }: NewsContentProps) {
  return (
    <div
      className={`news-content prose prose-neutral prose-sm max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
