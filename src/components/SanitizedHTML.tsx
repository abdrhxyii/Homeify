// components/SanitizedHTML.tsx
'use client';

import DOMPurify from 'dompurify';
import { useEffect, useState } from 'react';

interface SanitizedHTMLProps {
  html: string;
  className?: string;
}

const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({ html, className = '' }) => {
  const [sanitized, setSanitized] = useState('');

  useEffect(() => {
    const clean = DOMPurify.sanitize(html);
    setSanitized(clean);
  }, [html]);

  return (
    <div
      className={`prose max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitized }}
    />
  );
};

export default SanitizedHTML;
