import { CONFIG } from '../config';

export interface FooterProps {
  studentName?: string;
  nim?: string;
  courseName?: string;
}

export default function Footer({ courseName = CONFIG.courseName }: FooterProps) {
  return (
    <footer className="site-footer">
      <div className="container">
        <address>
          <strong>Art Archive</strong><br />
          Tugas Mata Kuliah {courseName}<br />
        </address>
      </div>
    </footer>
  );
}

export { Footer };
