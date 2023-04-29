
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import {  Button } from 'react-bootstrap';

import { Calendar, momentLocalizer } from 'react-big-calendar';
import { ref, onValue, set } from "firebase/database";
import { app } from '../../src/lib/firebase'; 
import { getAuth } from 'firebase/auth';
import 'firebase/auth';

// Styles
import randomColor from 'randomcolor';
import styles from '@/styles/calendar.module.css'
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-tooltip/dist/react-tooltip.css'

// Components
import CustomToolbar from '@/components/CustomToolbarCalendar';
// Libraries
import moment from 'moment';//time lib
import store from '../../utils/store';
import { db } from '../../src/lib/firebase';




 function MyCalendar() {
  const auth = getAuth(app);
  const [eventColors, setEventColors] = useState({});
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(true); // default user state
  const router = useRouter();
  const localizer = momentLocalizer(moment);
  
  const formats = { // React-big-calendar options
        weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture)};
 
       
  useEffect(() => { // Save event to Firebase when store changes
    const unsubscribe = store.subscribe(() => {
      const { event, uid } = store.getState();
      const eventRef = ref(db, `UserData/${uid}/events/${event.title}`);

        set(eventRef, {
        title: event.title,
        start: event.start,
        end: event.end,
        description: event.description,
        });
        
    });
    return () => {
      unsubscribe();
    };
  },[]);

  useEffect(() => {// Fetch events from Firebase when user state changes
    if (user == null) {
      router.push('/');
      } else {
          const uid = store.getState().uid;
          const eventsRef = ref(db, `UserData/${uid}/events`);
            
          onValue(eventsRef, (snapshot) => {
              const data = snapshot.val();
            if (data) {
                const newEvents = Object.keys(data).map((key) => {
                  return {
                  ...data[key],
                  start: new Date(data[key].start),
                  end: new Date(data[key].end),
                  };
                });
                setEvents(newEvents);
            }
          });
    }
  }, [user]);

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (uid && user) {
      const eventsRef = ref(db, `UserData/${uid}/events`);
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newEvents = Object.keys(data).map((key) => {
            return {
              ...data[key],
              start: new Date(data[key].start),
              end: new Date(data[key].end),
            };
          });
          setEvents(newEvents);
        }
      });
    }
  }, [user, store.getState().uid]); 
  useEffect(() => {
    const uid = localStorage.getItem('uid');
    if (uid) {
      const eventsRef = ref(db, `UserData/${uid}/events`);
      onValue(eventsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const newEvents = Object.keys(data).map((key) => {
            const color = eventColors[key] || randomColor({ luminosity: 'light' });
            return {
              ...data[key],
              start: new Date(data[key].start),
              end: new Date(data[key].end),
              color,
            };
          });
          setEvents(newEvents);
        }
      });
    }
  }, [eventColors]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  
  function my(){
    console.log('sfssf')
  }
  const Event = ({ event }) => {
    const [showModal, setShowModal] = useState(false);
  
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);
  
    return (
      <div >
        <div className={styles.eventTitle} title={event.description} onClick={handleShow}>
          {event.title}
        </div>
        <Modal show={showModal} className={styles.modalDescription} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{event.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{event.description}</Modal.Body>
          <Modal.Footer>
           
          </Modal.Footer>
        </Modal>
      </div>
    );
  };
  
  const handleEventDrop = ({ event, start, end }) => {
    const uid = store.getState().uid;
    const eventRef = ref(db, `UserData/${uid}/events/${event.title}`);
  
    set(eventRef, {
      ...event,
      start,
      end,
    });
  };
  const eventStyleGetter = (event, start, end, isSelected) => {
    return {
      style: {
        backgroundColor: event.color,
        borderRadius: '5px',
        opacity: 0.8,
        color: 'black',
        border: '0px',
        display: 'block',
      },
    };
  };

  
  const onDropFromOutside = ({ start, end, allDay }) => {
    const title = window.prompt('Event name');
    if (title) {
      const uid = store.getState().uid;
      const eventRef = ref(db, `UserData/${uid}/events/${title}`);
  
      set(eventRef, {
        title,
        start,
        end,
        allDay,
      });
    }
  };
  
  const handleSelect = ({ start, end }) => {
    const title = window.prompt('Event name');
    if (title) {
      const uid = store.getState().uid;
      const eventRef = ref(db, `UserData/${uid}/events/${title}`);
  
      set(eventRef, {
        title,
        start,
        end,
        allDay: false,
      });
    }
  };
  return (
    <div className={styles.calendarWrapper}>
      
      <div className={styles.calendar}>
      <Calendar
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          titleAccessor={(event) => event.description}
          formats={formats}
          eventPropGetter={eventStyleGetter}
          components={{
            toolbar: CustomToolbar,
            event: Event,
          }}
          className={styles.calendar}
          style={{
            height: '100%',
            width: '90%',
            backgroundColor: '#FFFF',
            border: 'none',
          }}
          events={events}
          selectable={false}
          onSelectEvent={handleEventClick}
          onSelectSlot={handleSelect}
          onEventDrop={handleEventDrop}
        />

      </div>
    </div>
  );  
}

export default MyCalendar;