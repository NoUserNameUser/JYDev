import Image from "next/image";

import type { CMSMedia } from "@/types/media";

type CMSImageProps = {
  image?: CMSMedia;
  alt?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
};

export function CMSImage({ image, alt, className, priority = false, sizes = "100vw" }: CMSImageProps) {
  if (!image?.url) return null;

  return (
    <Image
      className={className}
      src={image.url}
      alt={alt ?? image.alt ?? ""}
      width={image.width ?? 1200}
      height={image.height ?? 800}
      sizes={sizes}
      priority={priority}
    />
  );
}
