import React from "react";
import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "./Appointment";
import { getAppointmentsForDay , getInterview , getInterviewersForDay } from "helpers/selectors";
import useApplicationData from "hooks/useApplicationData";


export default function Application() {
  // import all the helper functions
  const {
    state,
    setDay,
    bookInterview,
    cancelInterview
  } = useApplicationData();
  
  // get the daily appointments and daily interviewers
  let dailyAppointments = getAppointmentsForDay(state, state.day);
  let dailyInterviewers = getInterviewersForDay(state, state.day);
  
  // render all the appointments for a given day
  const appointmentsArray = dailyAppointments.map(appointment => {
    const interview = getInterview(state, appointment.interview);

    return (
      <Appointment
        key={appointment.id}
        id={appointment.id}
        time={appointment.time}
        interview={interview}
        interviewers={dailyInterviewers}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });
  
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} value={state.day} onChange={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {appointmentsArray}
        <Appointment 
          key="last"
          time="5pm"/>
      </section>
    </main>
  );
}

