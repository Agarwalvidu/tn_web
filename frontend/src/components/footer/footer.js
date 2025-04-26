'use client';
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Image from 'next/image'; // Import Image from next/image
import './footer.css'; // Your custom styling file if any
import logo from '../../assets/logo.png'; // Import the logo image from assets

const Footer = () => {
  return (
    <>
      <footer className="main-footer">
        <div className="container">
          <div className="footer-content">
            <div className="row">
              <div className="col-lg-4 col-md-6 col-sm-12 footer-column">
                <div className="logo-widget footer-widget">
                  <figure className="logo-box">
                    <a href="#">
                      {/* Using Next.js Image component without object-fit to keep the original image size */}
                      <Image
                        src={logo}
                        alt="Logo"
                        width={200} // Set the desired width
                        height={200} // Set the desired height
                    
                      />
                    </a>
                  </figure>
                  <div className="text">
                    <p>
                      TechNeeds IGDTUW is a community which fosters a motive of "all_you_need_to_know_about_tech". We offer Tech Introductory sessions, Mentorship Programs, Hackathons and a competitive environment to learn and grow together.
                    </p>
                  </div>
                  <ul className="footer-social">
                    <li>
                      <a href="#">
                        <i className="fab fa-instagram"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-twitter"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-linkedin-in"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="fab fa-github"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 offset-lg-2 footer-column">
                <div className="service-widget footer-widget">
                  <div className="footer-title">Quick Links</div>
                  <ul className="list">
                    <li>
                      <a href="/dashboard">TechBoard</a>
                    </li>
                    <li>
                      <a href="/profile">Profile</a>
                    </li>
                    <li>
                      <a href="/events">Events</a>
                    </li>
                    <li>
                      <a href="/team">Team</a>
                    </li>
                    <li>
                      <a href="/faq">FAQs</a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 footer-widget">
                <div className="contact-widget footer-widget">
                  <div className="footer-title">Contacts</div>
                  <div className="text">
                    <p>You can DM you query on our Whatsapp or you can directly mail us.</p>
                    <a href="https://wa.me/918958898580"><p>+91 8958898580</p></a>
                    <a href="mailto:techneedsigdtuw@gmail.com"><p>techneedsigdtuw@gmail.com</p></a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <div className="footer-bottom">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6 col-sm-12 column">
              <div className="copyright">
                <a href="#">TechNeeds IGDTUW</a> &copy; 2025 All Right Reserved
              </div>
            </div>
            <div className="col-lg-6 col-md-6 col-sm-12 column">
              <ul className="footer-nav">
                <li>
                  <a href="#">Terms of Service</a>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;
