import Image from "next/image";

export interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
}

export interface ImageGalleryProps {
  images: GalleryImage[];
}

export function ImageGallery({ images }: ImageGalleryProps) {
  if (!images.length) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
      {images.map((img) => (
        <figure key={img.id} className="space-y-2">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-neutral-100">
            <Image
              src={img.url}
              alt={img.caption ?? ""}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, 50vw"
              unoptimized={!img.url.startsWith("http") || img.url.startsWith("data:")}
            />
          </div>
          {img.caption && (
            <figcaption className="text-sm text-neutral-500">
              {img.caption}
            </figcaption>
          )}
        </figure>
      ))}
    </div>
  );
}
