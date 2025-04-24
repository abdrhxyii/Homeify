import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import SanitizedHTML from '@/components/SanitizedHTML';

describe('SanitizedHTML Component', () => {
  it('renders sanitized HTML content', () => {
    const html = '<p>Hello <strong>World</strong></p>';
    render(<SanitizedHTML html={html} />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('World')).toBeInTheDocument();
  });

  it('removes unsafe script tags from HTML', () => {
    const html = '<p>Safe</p><script>alert("XSS")</script>';
    const { container } = render(<SanitizedHTML html={html} />);
    
    expect(container.innerHTML).toContain('Safe');
    expect(container.innerHTML).not.toContain('<script>');
    expect(container.innerHTML).not.toContain('alert("XSS")');
  });

  it('applies custom className to the wrapper div', () => {
    const html = '<p>Styled content</p>';
    const { container } = render(<SanitizedHTML html={html} className="text-red-500" />);
    expect(container.firstChild).toHaveClass('text-red-500');
  });
});
