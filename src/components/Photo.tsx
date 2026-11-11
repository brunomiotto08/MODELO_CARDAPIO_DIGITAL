import type { ImgHTMLAttributes } from 'react';
import { imageAttrs } from '../lib/images';

type PhotoProps = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  sizes?: string;
  priority?: boolean;
};

export default function Photo({
  src,
  sizes,
  priority = false,
  alt = '',
  loading,
  decoding,
  fetchPriority,
  ...rest
}: PhotoProps) {
  return (
    <img
      alt={alt}
      decoding={decoding ?? 'async'}
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      fetchPriority={fetchPriority ?? (priority ? 'high' : 'auto')}
      {...rest}
      {...imageAttrs(src, sizes)}
    />
  );
}
