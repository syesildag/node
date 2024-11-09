import React, { useEffect, useState } from "react";
import Page from "../../../../react/page";
import styles from "../../../styles/cv.module.css";

/*
(function() {
  $(".skills-soft li")
    .find("svg")
    .each(function(i) {
      var c, cbar, circle, percent, r;
      circle = $(this).children(".cbar");
      r = circle.attr("r");
      c = Math.PI * (r * 2);
      percent = $(this)
        .parent()
        .data("percent");
      cbar = (100 - percent) / 100 * c;
      circle.css({
        "stroke-dashoffset": c,
        "stroke-dasharray": c
      });
      circle.delay(i * 150).animate(
        {
          strokeDashoffset: cbar
        },
        1000,
        "linear",
        function() {
          return circle.css({
            "transition-duration": ".3s"
          });
        }
      );
      $(this)
        .siblings("small")
        .prop("Counter", 0)
        .delay(i * 150)
        .animate(
          {
            Counter: percent
          },
          {
            duration: 1000,
            step: function(now) {
              return $(this).text(Math.ceil(now) + "%");
            }
          }
        );
    });
}.call(this));
*/

interface SkillBarProps {
   percent: number;
   name: string;
}

function SkillBar({ percent, name }: SkillBarProps) {
   const [width, setWidth] = useState(0);
   useEffect(() => {
      setWidth(percent);
   }, [percent]);
   return (
      <li><span>{name}</span>
         <div className={styles['skills-bar']}>
            <div style={{
               width: width + "%",
               transition: 'width 1s',
            }} className={styles.bar} />
         </div>
      </li>
   );
}

export default class Cv extends Page {
   render() {
      return super.render(
         <>
            <div className={styles.resume}>
               <div className={styles.base}>
                  <div className={styles.profile}>
                     <div className={styles.info}>
                        <h1 className={styles.name}>Serkan YESILDAG</h1>
                        <h2 className={styles.job}>Software Engineer</h2>
                     </div>
                  </div>
                  <div className={styles.about}>
                     <h3>About Him</h3>
                     He is a software engineer having an experience of more than 10 years in the field of software development.
                     He is a full-stack developer with hands-on experience in developing web applications and standalone applications.
                     He is a tech enthusiast and always eager to learn new technologies.
                     He is a quick learner and always ready to take new challenges.
                  </div>
                  <div className={styles.contact}>
                     <h3>Contact Me</h3>
                     <div className={styles.call}><a href="tel:123-456-7890"><i className="fas fa-phone"></i><span>123-456-7890</span></a></div>
                     <div className={styles.address}><a href="https://goo.gl/maps/fiTBGT6Vnhy"><i className="fas fa-map-marker"></i><span>Provo, Utah</span></a>
                     </div>
                     <div className={styles.email}><a href="mailto:astronaomical@gmail.com"><i className="fas fa-envelope"></i><span>astronaomical</span></a></div>
                     <div className={styles.website}><a href="http://astronaomical.com/" target="_blank"> <i className="fas fa-home"></i><span>astronaomical.com</span></a></div>
                  </div>
                  <div className={styles.follow}>
                     <h3>Follow Me</h3>
                     <div className={styles.box}>
                        <a href="https://www.facebook.com/astronaomical/" target="_blank"><i className="fab fa-facebook"></i></a>
                        <a href="https://www.instagram.com/astronaomical/" target="_blank"><i className="fab fa-instagram "></i></a>
                        <a href="https://www.pinterest.com/astronaomical/" target="_blank"><i className="fab fa-pinterest"></i></a>
                        <a href="https://www.linkedin.com/in/naomi-weatherford-758385112/" target="_blank"><i className="fab fa-linkedin"></i></a>
                        <a href="https://codepen.io/astronaomical/" target="_blank"><i className="fab fa-codepen"></i></a>
                        <a href="https://www.behance.net/astronaomical" target="_blank"><i className="fab fa-behance"></i></a>
                     </div>
                  </div>
               </div>
               <div className={styles.func}>
                  <div className={styles.work}>
                     <h3><i className="fa fa-briefcase"></i>Experience</h3>
                     <ul>
                        <li><span>Software Enginner -<br /></span><small>Septeo-FRANCE</small><small>Sep 2023 - Now</small></li>
                        <li><span>Software Enginner</span><small>Sequoiasoft-FRANCE</small><small>Apr 2010 - Sep 2023</small></li>
                        <li><span>Software Enginner</span><small>SoftBooking-FRANCE</small><small>May 2007 - Apr 2010</small></li>
                        <li><span>Freelance Software Engineer</span><small>France</small><small>Jun 2002 - May 2007</small></li>
                     </ul>
                  </div>
                  <div className={styles.edu}>
                     <h3><i className="fa fa-graduation-cap"></i>Education</h3>
                     <ul>
                        <li><span>PhD<br />EURECOM</span><small>Valbonne-FRANCE</small><small>Sep. 2001 - May. 2002</small></li>
                        <li><span>Master of Science<br />Bilkent University</span><small>Ankara-TURKEY</small><small>Sep. 1999 - Jun. 2001</small></li>
                        <li><span>Bachelor of Science<br />Bilkent University</span><small>Ankara-TURKEY</small><small>Sep. 1994 - Jun. 1999</small></li>
                     </ul>
                  </div>
                  <div className={styles['skills-prog']}>
                     <h3><i className="fas fa-code"></i>Programming Skills</h3>
                     <ul>
                        <SkillBar percent={50} name="HTML" />
                        <SkillBar percent={80} name="JavaScript" />
                        <SkillBar percent={90} name="Java" />
                        <SkillBar percent={70} name="SQL" />
                     </ul>
                  </div>
                  <div className={styles['skills-soft']}>
                     <h3><i className="fas fa-bezier-curve"></i>Software Skills</h3>
                     <ul>
                        <li data-percent="90">
                           <svg viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="45"></circle>
                              <circle className={styles.cbar} cx="50" cy="50" r="45"></circle>
                           </svg><span>Illustrator</span><small></small>
                        </li>
                        <li data-percent="75">
                           <svg viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="45"></circle>
                              <circle className={styles.cbar} cx="50" cy="50" r="45"></circle>
                           </svg><span>Photoshop</span><small></small>
                        </li>
                        <li data-percent="85">
                           <svg viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="45"></circle>
                              <circle className={styles.cbar} cx="50" cy="50" r="45"></circle>
                           </svg><span>InDesign</span><small></small>
                        </li>
                        <li data-percent="65">
                           <svg viewBox="0 0 100 100">
                              <circle cx="50" cy="50" r="45"></circle>
                              <circle className={styles.cbar} cx="50" cy="50" r="45"></circle>
                           </svg><span>Dreamweaver</span><small></small>
                        </li>
                     </ul>
                  </div>
                  <div className={styles.interests}>
                     <h3><i className="fas fa-star"></i>Interests</h3>
                     <div className={styles['interests-items']}>
                        <div className={styles.art}><i className="fas fa-palette"></i><span>Art</span></div>
                        <div className={styles.art}><i className="fas fa-book"></i><span>Books</span></div>
                        <div className={styles.movies}><i className="fas fa-film"></i><span>Movies</span></div>
                        <div className={styles.music}><i className="fas fa-headphones"></i><span>Music</span></div>
                        <div className={styles.games}><i className="fas fa-gamepad"></i><span>Games</span></div>
                     </div>
                  </div>
               </div>
            </div>
         </>
      );
   }
}