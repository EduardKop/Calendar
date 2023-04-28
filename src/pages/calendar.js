
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import { ref, onValue, set } from "firebase/database";
// Styles
import styles from '@/styles/calendar.module.css'
import 'react-big-calendar/lib/sass/styles.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css';
// Components
import CustomToolbar from '@/components/CustomToolbarCalendar';
// Libraries
import moment from 'moment';//time lib
import store from '../../utils/store';
import { db } from '../../src/lib/firebase';

export  function MyCalendar() {
  const [events, setEvents] = useState([]);
  const [user, setUser] = useState(true); // default user state
  const router = useRouter();
  const localizer = momentLocalizer(moment);

  const formats = { // React-big-calendar options
        weekdayFormat: (date, culture, localizer) => localizer.format(date, 'dddd', culture)};
 
  const handleLogout = () => {//Logout button logic
        setUser(null);};

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
    const uid = store.getState().uid;
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
  
  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };
  
  const Event = ({ event }) => (
    <div className={styles.event}>
      <div className={styles.eventTitle}>{event.title}</div>
      <div className={styles.eventDescription}>{event.description}</div>
    </div>
  );

  return (
    <div className={styles.calendarWrapper}>
      <div className={styles.logOutwrapper}>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div className={styles.calendar}>
        <Calendar 
          localizer={localizer}
          startAccessor="start"
          endAccessor="end"
          formats={formats}
          titleAccessor={event => event.description}
          components={{
            toolbar: CustomToolbar,
            event: Event
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
        />
      </div>
    </div>
  );  
}

export default MyCalendar;