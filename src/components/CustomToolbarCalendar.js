import { useState } from 'react';
import styles from '@/styles/calendar.module.css'
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Image from 'next/image'

import arrowLeftImg  from '../../public/images/arrowLeft.png'
import arrowRightImg from '../../public/images/arrowRight.png'
import arrowDownImg  from '../../public/images/arrowDown.png'


import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';



const CustomToolbar = (toolbar) => {
   
   const goToPrev = () => {toolbar.onNavigate('PREV');}; //OnClick Lower the month 
   const goToNext = () => {toolbar.onNavigate('NEXT');}; //OnClick Upper the month 
 
 
   
   const currentDate = moment(toolbar.date).format('MMMM YYYY');
   const nowDate = moment().format('MMMM DD');
   const Month = moment(toolbar.date).format('MMMM');
 
   
   const handleMonthChange = (e) => {
      const month = parseInt(e.target.getAttribute('data-month'));
      const newDate = moment(toolbar.date).month(month);
      toolbar.onNavigate('DATE', newDate);
      setShowDropdown(false);
   };
   
   const [showDropdown, setShowDropdown] = useState(false);
   const toggleDropdown = () => setShowDropdown(!showDropdown);
   
   return (
     <div className="rbc-toolbar">
 
       <div className={styles.current_date}>
         <h1>Today, {nowDate}</h1>
       </div>
       
       <div className={styles.control_elements}>
 
         <div className={styles.rbc_btn_group}>
         <Image
            src={arrowLeftImg}
            onClick={goToPrev}/> 
         <div className={styles.rbc_toolbar_label}>{currentDate}</div>
           <Image
            src={arrowRightImg}
            onClick={goToNext}/> 
         </div>
 
         <div className={styles.rbc_btn_group}>
         <div
           className={styles.rbc_dropdown}
           onClick={toggleDropdown}
           onBlur={() => setShowDropdown(false)}
           tabIndex={0}
         >
           <div>{Month}</div>
           {showDropdown && (
             <ul className={styles.rbc_dropdown_list}>
               {moment.months().map((label, value) => (
                 <li
                   key={value}
                   data-month={value}
                   onClick={handleMonthChange}
                 >
                   {label}
                 </li>
               ))}
             </ul>
           )}
         </div>
         <div  className={styles.rbc_dropdown_list_img}>
         <Image
           
            src={arrowDownImg}
            onClick={toggleDropdown}/> 
           </div>
       </div>
 
         {/* <div className={styles.rbc_btn_group}>
         <Image
           src={arrowLeftImg}
           onClick={goToPrev}/> 
         <div className={styles.rbc_toolbar_label}>{currentDate}</div>
           <Image
            src={arrowRightImg}
            onClick={goToNext}/> 
         </div> */}
       </div>
       
     </div>
   );
 };

 export default CustomToolbar