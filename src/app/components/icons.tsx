import { Star, Circle, Triangle, Square } from 'lucide-react';
import type { FC } from 'react';

export const shapeIcons: Record<string, FC<{ className?: string }>> = {
  star: (props) => <Star {...props} />,
  circle: (props) => <Circle {...props} />,
  triangle: (props) => <Triangle {...props} />,
  square: (props) => <Square {...props} />,
};

export const ShapeIcon = ({ shape, className }: { shape: string; className?: string }) => {
  const IconComponent = shapeIcons[shape];
  if (!IconComponent) {
    return <Square className={className} />; // Default icon
  }
  return <IconComponent className={className} />;
};
