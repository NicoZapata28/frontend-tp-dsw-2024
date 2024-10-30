import { Container } from 'react-bootstrap';
import { CSSProperties, useEffect, useState } from 'react';

const Footer = () => {
  const footerStyle: CSSProperties = {
    padding: '1rem',
    fontSize: '1rem',
    backgroundColor: '#343a40',
    color: 'white',
    textAlign: 'center' as const,
    width: '100%',
  };

  const mobileFooterStyle: CSSProperties = {
    padding: '0.5rem',
    fontSize: '0.875rem',
  };

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <footer
      className="footer mt-auto py-4"
      style={{
        ...footerStyle,
        ...(isMobile ? mobileFooterStyle : {}),
      }}
    >
      <Container>
        <p>© 2024 TecnoStore. All rights reserved.</p>
      </Container>
    </footer>
  );
};

export default Footer;