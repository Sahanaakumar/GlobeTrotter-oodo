import { Globe } from 'lucide-react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 'text-xl' },
    md: { icon: 32, text: 'text-2xl' },
    lg: { icon: 48, text: 'text-4xl' }
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Globe 
          size={sizes[size].icon} 
          className="text-teal-600" 
          strokeWidth={2}
        />
      </div>
      {showText && (
        <span className={`${sizes[size].text} font-bold bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent`}>
          GlobeTrotter
        </span>
      )}
    </div>
  );
}
