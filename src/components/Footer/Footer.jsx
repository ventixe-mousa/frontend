import React from 'react';
import './Footer.css';

import LinkedinIcon from '../../assets/linkedin.png';
import YoutubeIcon  from '../../assets/youtube.png';
import CameraIcon   from '../../assets/kamera.png';
import XIcon        from '../../assets/x.png';
import FacebookIcon from '../../assets/facebook.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__left">
        <span className="footer__text footer__text--left">
          Copyright © 2025 Peterdraw
        </span>
      </div>

      <div className="footer__center">
        <span className="footer__link">Privacy Policy</span>
        <span className="footer__link">Term and Conditions</span>
        <span className="footer__link">Contact</span>
      </div>
      
      <div className="footer__right">
        <img src={LinkedinIcon}  alt="LinkedIn"  className="footer__icon" />
        <img src={YoutubeIcon}   alt="YouTube"   className="footer__icon" />
        <img src={CameraIcon}    alt="Camera"    className="footer__icon" />
        <img src={XIcon}         alt="X"         className="footer__icon" />
        <img src={FacebookIcon}  alt="Facebook"  className="footer__icon" />
      </div>
    </footer>
  );
}
