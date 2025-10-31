import Image from "next/image";

interface NFTMediaProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  mediaType: 'image' | 'video' | 'audio';
}

export function NFTMedia({ src, alt, width, height, className, mediaType }: NFTMediaProps) {

  if (mediaType === 'video') {
    return (
      <video
        src={src}
        width={width}
        height={height}
        className={className}
        playsInline
        controls
      />
    );
  }

  if (mediaType === 'audio') {
    return (
      <div className={`relative flex items-center justify-center bg-card ${className}`}>
        <Image src={"/placeholder-logo.svg"} alt="audio file" layout="fill" objectFit="cover" />
        <audio src={src} controls className="absolute bottom-0 left-0 w-full" />
      </div>
    );
  }

  return (
    <Image
      src={src || "/placeholder.svg"}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={(e) => (e.currentTarget.src = "/placeholder.svg")}
    />
  );
}