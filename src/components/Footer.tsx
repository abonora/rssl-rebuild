export const Footer = () => {
  return (
    <footer className="legal-footer">
      <div className="footer-content">
        <p>© {new Date().getFullYear()} albertobonora.com. All rights reserved.</p>
        <div className="footer-links">
          <a href="/privacy">Privacy Policy</a>
          <a href="/terms">Terms of Service</a>
          <a href="/contact">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 