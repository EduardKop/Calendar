import React,{ useState } from 'react';
import { useDispatch } from 'react-redux';
import store from '../../utils/store';

// Firebase imports
import { db } from '../lib/firebase';
import { getDatabase, onValue, ref, get , push , set } from "firebase/database";

// UI component imports
import Image from 'next/image'
import { Modal, Button } from 'react-bootstrap';

// Styling imports
import styles from '@/styles/calendar.module.css'
import stylesMadal from '@/styles/modal.module.css'
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Calendar library imports
import { momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

// Image imports
import arrowLeftImg  from '../../public/images/arrowLeft.png'
import arrowRightImg from '../../public/images/arrowRight.png'
import arrowDownImg  from '../../public/images/arrowDown.png'
import plusButtonImg from '../../public/images/plus.png'


const CustomToolbar = (toolbar) => {
   
    const goToPrev = () => {toolbar.onNavigate('PREV');}; //OnClick Lower the month 
    const goToNext = () => {toolbar.onNavigate('NEXT');}; //OnClick Upper the month 
 
    // State for modal and input values
    const [showModal, setShowModal] = useState(false);
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventStartDate, setEventStartDate] = useState('');
    const [formErrors, setFormErrors] = useState({
      eventName: '',
      eventStartDate: '',
      eventDescription: '',
    });
    const [showDropdown, setShowDropdown] = useState(false);

    const dispatch = useDispatch();



    const handleFormSubmit = (e) => {
      e.preventDefault();
      const now = new Date().toISOString().split('T')[0];
      if (eventStartDate < now) {//Time Err Handler
        alert(`Обарана дата - ${eventStartDate} не може бути добавлена, введіть коректну дату - сьогоднішню або майбутню 🙂`);
      return;
      }
      const event = {
        title: eventName,
        start: eventStartDate,
        end: eventStartDate,
        description: eventDescription,
      };
      dispatch({ type: 'SET_EVENT', payload: event });
     
      const uid = store.getState().uid;
      try {
        const eventsRef = ref(db, `UserData/${uid}/events/${event.title}`);//add events to firebase db
        set(eventsRef, {
          title: event.title,
          start: event.start,
          end: event.end,
          description: event.description,
        });
        setShowModal(false);
      }
      catch(err){
      console.log(err)
      }
    };


    const handleCloseModal = (e) => {//close modal -Close btn-
    e.preventDefault();
    setShowModal(false);
    };

    //format times
    const currentDate = moment(toolbar.date).format('MMMM YYYY');
    const nowDate = moment().format('MMMM DD');
    const Month = moment(toolbar.date).format('MMMM');

    const handleMonthChange = (e) => {
      const month = parseInt(e.target.getAttribute('data-month'));
      const newDate = moment(toolbar.date).month(month);
      toolbar.onNavigate('DATE', newDate);
      setShowDropdown(false);
    };
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
    <form>
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

      <Button type="submit"className={stylesMadal.cancel_btn} onClick={handleCloseModal}>Cancel</Button>
      <Button type="submit"className={stylesMadal.save_btn} onClick={handleFormSubmit}>Save</Button>

      </div>
      
    </form>
  </Modal.Body>
</Modal>
     </div>
   );
 };

 export default CustomToolbar