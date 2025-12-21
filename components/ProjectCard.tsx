'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface ProjectCardProps {
  type: string;
  title: string;
  titleHighlight: string;
  company: string;
  readTime: string;
  actionText: string;
  screenshot?: string;
  icon?: string;
  gradientStart?: string;
  gradientEnd?: string;
  textColor?: string;
  highlightColor?: string;
  buttonIcon?: string;
  iconColor?: string;
}

// Helper function to convert hex to CSS filter for SVG color change
function hexToFilter(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse RGB values
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // For #53D781 (green), use a specific filter
  // This is a simplified approach that works well for most colors
  // For exact color matching, consider using SVG with currentColor or inline SVG
  if (hex.toLowerCase() === '53d781') {
    return 'brightness(0) saturate(100%) invert(67%) sepia(67%) saturate(500%) hue-rotate(90deg) brightness(110%)';
  }
  
  // Generic filter for other colors (approximation)
  const rPercent = (r / 255) * 100;
  const gPercent = (g / 255) * 100;
  const bPercent = (b / 255) * 100;
  
  return `brightness(0) saturate(100%) invert(${rPercent}%) sepia(${gPercent}%) saturate(${bPercent * 2}%) hue-rotate(${Math.round((g - r) / 2)}deg) brightness(${(r + g + b) / 3 / 255})`;
}

export default function ProjectCard({
  type,
  title,
  titleHighlight,
  company,
  readTime,
  actionText,
  screenshot,
  icon = '/desktop-icon.svg',
  gradientStart = '#012A59',
  gradientEnd = '#010101',
  textColor = '#D7E1F9',
  highlightColor = '#499BF8',
  buttonIcon = '/arrow-icon.svg',
  iconColor,
}: ProjectCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-0 relative project-card-inner-border"
      style={{ 
        borderRadius: '32px',
        overflow: 'hidden'
      }}
    >
      {/* Left Panel - Dark Blue */}
      <div className="flex flex-col justify-between" style={{ padding: '48px', background: `linear-gradient(135deg, ${gradientStart} 0%, ${gradientEnd} 100%)` }}>
        <div style={{ maxWidth: '444px' }}>
          <div className="flex items-center" style={{ gap: '10px', marginBottom: '32px' }}>
            <Image 
              src={
                highlightColor === '#53D781' && icon === '/desktop-icon.svg'
                  ? '/desktop-icon-green-bright.svg'
                  : iconColor === '#D6F5E1' && icon === '/desktop-icon.svg' 
                  ? '/desktop-icon-green.svg' 
                  : icon
              } 
              alt={type} 
              width={24} 
              height={24} 
              className="inline-block"
            />
            <span className="tracking-[-0.01em] font-inter font-medium" style={{ fontSize: '20px', lineHeight: '24px', color: textColor }}>{type}</span>
          </div>
          <h3 className="text-[36px] font-semibold tracking-[-0.03em]" style={{ lineHeight: '44px', marginBottom: '24px', maxWidth: '444px', wordWrap: 'break-word', whiteSpace: 'normal' }}>
            <span style={{ color: textColor }}>{title}{' '}</span>
            <span style={{ color: highlightColor }}>{titleHighlight}</span>
          </h3>
          <p className="font-inter font-normal text-[22px] tracking-[-0.01em]" style={{ lineHeight: '32px', color: textColor, marginBottom: '72px' }}>
            {company} · {readTime}
          </p>
        </div>
        <button className="flex items-center justify-between transition-all font-inter font-medium tracking-[-0.02em] w-full project-card-button" style={{ fontSize: '22px', lineHeight: '28px', color: textColor, maxWidth: '444px', backgroundColor: 'rgba(215, 231, 249, 0.06)', padding: '18px 24px', borderRadius: '20px' }}>
          <span>{actionText}</span>
          <Image 
            src={iconColor === '#D6F5E1' && buttonIcon === '/arrow-icon.svg' ? '/arrow-icon-green.svg' : buttonIcon} 
            alt="Button icon" 
            width={24} 
            height={24}
          />
        </button>
      </div>

      {/* Right Panel - Image */}
      <div className="flex items-center justify-center" style={{ width: '540px', height: '440px', overflow: 'hidden' }}>
        {screenshot ? (
          <Image 
            src={screenshot} 
            alt="Project screenshot" 
            width={540}
            height={440}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="text-center text-gray-400">
            <p className="text-lg">Screenshot placeholder</p>
            <p className="text-sm mt-2">Image will be provided</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
