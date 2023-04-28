import { useState } from 'react';
import styles from '@/styles/calendar.module.css'
import stylesMadal from '@/styles/modal.module.css'

import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Image from 'next/image'
//Bootstrap
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import arrowLeftImg  from '../../public/images/arrowLeft.png'
import arrowRightImg from '../../public/images/arrowRight.png'
import arrowDownImg  from '../../public/images/arrowDown.png'
import plusButtonImg from '../../public/images/plus.png'


import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';


const CustomToolbar = (toolbar) => {
   
   const goToPrev = () => {toolbar.onNavigate('PREV');}; //OnClick Lower the month 
   const goToNext = () => {toolbar.onNavigate('NEXT');}; //OnClick Upper the month 
 
   //modal
   const [showModal, setShowModal] = useState(false);
   const [eventName, setEventName] = useState('');
   const [eventDescription, setEventDescription] = useState('');

   const [eventStartDate, setEventStartDate] = useState('');
   
const handleFormSubmit = (e) => {
   e.preventDefault();
   const event = {
     name: eventName,
     startDate: eventStartDate,
     description: eventDescription,
   };
   console.log(event)


   setShowModal(false);
 };


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
 
         <div className={styles.rbc_btn_add_tasks}onClick={() => setShowModal(true)}   style={{ top: 0, right: 0, left: "auto", bottom: "auto" }}
>
         <Image
           src={plusButtonImg}
          /> 
          <span>Add Event</span>
         </div> 
       </div>


       <Modal show={showModal} onHide={() => setShowModal(false)} className="modal-blur">
  <Modal.Header  >
    <Modal.Title>Add Event</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <form onSubmit={handleFormSubmit}>
      <div className={stylesMadal.form_group}>
        <label htmlFor="eventName"></label>
        <input
         placeholder='Event Name'
          type="text"
          className="form-control"
          id="eventName"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />
      </div>
      <div className={stylesMadal.form_group}>
        <label htmlFor="eventStartDate"></label>
        <input
          type="date"
          className="form-control"
          id="eventStartDate"
          value={eventStartDate}
          onChange={(e) => setEventStartDate(e.target.value)}
        />
      </div>
      <div className={stylesMadal.form_group}>
        <label htmlFor="eventDescription"></label>
        <input
          type="text"
          className="form-control"
          id="eventDecription"
          value={eventDescription}
          placeholder='Description'
          onChange={(e) => setEventDescription(e.target.value)}
        />
      </div>
      <div className={stylesMadal.modal_control}>

      <Button type="submit"className={stylesMadal.cancel_btn}>Cancel</Button>
      <Button type="submit"className={stylesMadal.save_btn}>Save</Button>

      </div>
      
    </form>
  </Modal.Body>
</Modal>
     </div>
   );
 };

 export default CustomToolbar