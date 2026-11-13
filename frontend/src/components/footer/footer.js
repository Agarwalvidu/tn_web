import Image from 'next/image';
import Link from 'next/link';
import './footer.css';
import logo from '../../assets/logo.png';

const QUICK = [
  ['/', 'Home'],
  ['/cohorts', 'Cohorts'],
  ['/leaderboard', 'Leaderboard'],
  ['/techboard', 'Techboard'],
  ['/faq', 'FAQs'],
];

export default function Footer() {
  return (
    <footer className="ft">
      <div className="ft-inner">
        <div className="ft-brand">
          <div className="ft-logo-row">
            <span className="ft-logo-bg"><Image src={logo} alt="" width={44} height={44} /></span>
            <span className="ft-name">Tech<b>Needs</b> IGDTUW</span>
          </div>
          <p>
            TechNeeds IGDTUW is a community which fosters a motive of &quot;all_you_need_to_know_about_tech&quot;. We offer Tech Introductory
            sessions, Mentorship Programs, Hackathons and a competitive environment to learn and grow together.
          </p>
          <ul className="ft-social" aria-label="Social links">
            <li><a href="#" aria-label="Instagram"><i className="fab fa-instagram" /></a></li>
            <li><a href="#" aria-label="X (Twitter)"><i className="fab fa-x-twitter" /></a></li>
            <li><a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in" /></a></li>
            <li><a href="#" aria-label="GitHub"><i className="fab fa-github" /></a></li>
          </ul>
        </div>

        <div>
          <h4 className="ft-title">Quick links</h4>
          <ul className="ft-list">
            {QUICK.map(([href, label]) => <li key={href}><Link href={href}>{label}</Link></li>)}
          </ul>
        </div>

        <div>
          <h4 className="ft-title">Contact us</h4>
          <p className="ft-text">DM your query on WhatsApp or mail us directly.</p>
          <ul className="ft-list">
            <li><a href="https://wa.me/918958898580"><i className="fab fa-whatsapp" /> +91 8958898580</a></li>
            <li><a href="mailto:techneedsigdtuw@gmail.com"><i className="fas fa-envelope" /> techneedsigdtuw@gmail.com</a></li>
          </ul>
        </div>
      </div>

      <div className="ft-bottom">
        <span>&copy; {new Date().getFullYear()} TechNeeds IGDTUW. All rights reserved.</span>
        <span className="ft-legal"><a href="#">Terms of Service</a><a href="#">Privacy Policy</a></span>
      </div>
    </footer>
  );
}
