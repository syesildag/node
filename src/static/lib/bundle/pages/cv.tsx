import styled from "@emotion/styled";
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import WorkIcon from '@mui/icons-material/Work';
import SchoolIcon from '@mui/icons-material/School';
import CodeIcon from '@mui/icons-material/Code';
import { SvgIconProps, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
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

function createStyled<C extends OverridableComponent<SvgIconTypeMap>>(svgIcon: C) {
   return styled(svgIcon)<SvgIconProps>(({ theme }) => ({
      color: 'var(--color-yellow)',
      verticalAlign: 'sub',
   }));
}

const StyledPhoneIcon = createStyled(PhoneIcon);
const StyledEmailIcon = createStyled(EmailIcon);
const StyledWorkIcon = createStyled(WorkIcon);
const StyledSchoolIcon = createStyled(SchoolIcon);
const StyledCodeIcon = createStyled(CodeIcon);

interface SkillBarProps {
   percent: number;
   name: string;
}

function SkillBar({ percent, name }: SkillBarProps) {
   const [width, setWidth] = useState(0);
   useEffect(() => {
      requestAnimationFrame(() => setWidth(percent));
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
                     <p>
                        With over a decade of experience in software development, this individual has honed his skills as a full-stack developer, capable of crafting both web and standalone applications.
                     </p>
                     <p>
                        His expertise extends to a wide range of programming languages and technologies, including Java, JavaScript, and SQL, among others.
                     </p>
                     <p>
                        His enthusiasm for technology is not just a professional attribute but a personal passion, driving him to continuously explore and master new advancements in the field.
                     </p>
                     <p>
                        This dedication to learning is complemented by an ability to quickly assimilate new information, making him well-equipped to tackle and triumph over new challenges that come his way.
                     </p>
                     <p>
                        His career trajectory is a testament to his commitment to growth and excellence in the ever-evolving landscape of software engineering.
                     </p>
                  </div>
                  <div className={styles.contact}>
                     <h3>Contact Me</h3>
                     <div className={styles.call}><a href="tel:06.25.99.23.24"><StyledPhoneIcon/><span>06.25.99.23.24</span></a></div>
                     <div className={styles.email}><a href="mailto:syesildag@hotmail.com"><StyledEmailIcon /><span>syesildag@hotmail.com</span></a></div>
                  </div>
                  <div className={styles.follow}>
                     <h3>Follow Me</h3>
                     <div className={styles.box}>
                        <a href="https://www.linkedin.com/in/serkan-yesildag-816542314/" target="_blank"><i className="fab fa-linkedin"></i></a>
                     </div>
                  </div>
               </div>
               <div className={styles.func}>
                  <div className={styles.work}>
                     <h3><i><StyledWorkIcon /></i>Experience</h3>
                     <ul>
                        <li><span>Software Enginner -<br /></span><small>Septeo-FRANCE</small><small>Sep 2023 - Now</small></li>
                        <li><span>Software Enginner</span><small>Sequoiasoft-FRANCE</small><small>Apr 2010 - Sep 2023</small></li>
                        <li><span>Software Enginner</span><small>SoftBooking-FRANCE</small><small>May 2007 - Apr 2010</small></li>
                        <li><span>Freelance Software Engineer</span><small>France</small><small>Jun 2002 - May 2007</small></li>
                     </ul>
                  </div>
                  <div className={styles.edu}>
                     <h3><i><StyledSchoolIcon /></i>Education</h3>
                     <ul>
                        <li><span>PhD<br />EURECOM</span><small>Valbonne-FRANCE</small><small>Sep. 2001 - May. 2002</small></li>
                        <li><span>Master of Science<br />Bilkent University</span><small>Ankara-TURKEY</small><small>Sep. 1999 - Jun. 2001</small></li>
                        <li><span>Bachelor of Science<br />Bilkent University</span><small>Ankara-TURKEY</small><small>Sep. 1994 - Jun. 1999</small></li>
                     </ul>
                  </div>
                  <div className={styles['skills-prog']}>
                     <h3><i><StyledCodeIcon /></i>Programming Skills</h3>
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