import styled from "@emotion/styled";
import CodeIcon from '@mui/icons-material/Code';
import EmailIcon from '@mui/icons-material/Email';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { SvgIconProps, SvgIconTypeMap } from "@mui/material";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import React, { CSSProperties, useEffect, useState } from "react";
import Page from "../../../../react/page";
import styles from "../../../styles/cv.module.css";

function createWithStyle<C extends OverridableComponent<SvgIconTypeMap>>(svgIcon: C, props: CSSProperties = {}) {
   return styled(svgIcon)<SvgIconProps>(({ theme }) => ({
      color: 'var(--color-yellow)',
      verticalAlign: 'sub',
      ...props
   }));
}

const StyledPhoneIcon = createWithStyle(PhoneIcon);
const StyledEmailIcon = createWithStyle(EmailIcon);
const StyledWorkIcon = createWithStyle(WorkIcon);
const StyledSchoolIcon = createWithStyle(SchoolIcon);
const StyledCodeIcon = createWithStyle(CodeIcon);
const StyledLinkedInIcon = createWithStyle(LinkedInIcon, {
   color: 'var(--color-black)',
   transform: 'scale(1.5)',
   verticalAlign: 'inherit',
});

interface PercentProps {
   percent: number;
   name: string;
}

function SkillBar({ percent, name }: PercentProps) {
   const [width, setWidth] = useState(0);
   useEffect(() => {
      requestAnimationFrame(() => setWidth(percent));
   }, [percent]);
   return <>
      <span>{name}</span>
      <div className={styles['skills-bar']}>
         <div style={{
            width: width + "%",
            transition: 'width 2s',
         }} className={styles.bar} />
      </div>
   </>;
}

interface CircleProps extends PercentProps {
   cx: number;
   cy: number;
   r: number;
   duration?: number;
}

function SoftCircle({ percent, name, cx, cy, r, duration = 2 }: CircleProps) {
   let c = Math.PI * (r * 2);
   let cbar = (100 - percent) / 100 * c;

   const [offset, setOffset] = useState(c);
   const [now, setNow] = useState(String(0));

   const iterations = 20;

   let step = percent / iterations;
   let ms = (duration * 1000) / iterations;

   function repeat(n: string) {
      setTimeout(() => {
         let d = parseFloat(n);
         d += step;
         setNow(d.toFixed(2));
         if (d < percent)
            repeat(String(d));
      }, ms);
   }

   useEffect(() => {
      requestAnimationFrame(() => setOffset(cbar));
      repeat(now);
   }, [percent]);

   return <>
      <svg viewBox="0 0 100 100">
         <circle cx={cx} cy={cy} r={r}></circle>
         <circle className={styles.cbar}
            cx={cx}
            cy={cy}
            r={r}
            style={{
               strokeDashoffset: offset,
               strokeDasharray: c,
               transitionDuration: duration + 's',
            }}>
         </circle>
      </svg>
      <div>
         <span>{name}</span>
         <small>{now}%</small>
      </div>
   </>;
}

export default class Cv extends Page {
   render() {
      return super.render(
         <>
            <div className={styles.resume}>
               <div className={styles.base}>
                  <div className={styles.profile}>
                     <div className={styles.photo}>
                        <img src="/static/images/me.jpg" alt="Serkan YESILDAG" />
                     </div>
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
                     <div className={styles.call}><a href="tel:06.25.99.23.24"><StyledPhoneIcon /><span>06.25.99.23.24</span></a></div>
                     <div className={styles.email}><a href="mailto:syesildag@hotmail.com"><StyledEmailIcon /><span>syesildag@hotmail.com</span></a></div>
                  </div>
                  <div className={styles.follow}>
                     <h3>Follow Me</h3>
                     <div className={styles.box}>
                        <a href="https://www.linkedin.com/in/serkan-yesildag-816542314/" target="_blank"><i><StyledLinkedInIcon /></i></a>
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
                        <li><SkillBar percent={50} name="HTML" /></li>
                        <li><SkillBar percent={80} name="TypeScript" /></li>
                        <li><SkillBar percent={80} name="JavaScript" /></li>
                        <li><SkillBar percent={90} name="NodeJS" /></li>
                        <li><SkillBar percent={90} name="Java" /></li>
                        <li><SkillBar percent={70} name="SQL" /></li>
                     </ul>
                  </div>
                  <div className={styles['skills-soft']}>
                     <h3><i className="fas fa-bezier-curve"></i>Software Skills</h3>
                     <ul>
                        <li><SoftCircle cx={50} cy={50} r={45} percent={80} name="React" /></li>
                        <li><SoftCircle cx={50} cy={50} r={45} percent={75} name="MaterialUI" /></li>
                        <li><SoftCircle cx={50} cy={50} r={45} percent={90} name="IntelliJ IDEA" /></li>
                        <li><SoftCircle cx={50} cy={50} r={45} percent={70} name="Visual Studio Code" /></li>
                     </ul>
                  </div>
               </div>
            </div>
         </>
      );
   }
}