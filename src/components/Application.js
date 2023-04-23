import React, {useEffect, useState} from "react";
import axios from "axios";
import "components/Application.scss";
import DayList from "components/DayList.js";
import Appointment from "./Appointment";
import { getAppointmentsForDay } from "helpers/selectors";

let dailyAppointments = [];

export default function Application(props) {
  const setDay = day => setState({ ...state, day });
  // const setDays = days => setState(prev => ({...prev, days }));
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  })

  useEffect(() => {
    const routes = {
      "GET_DAYS":     `http://localhost:8001/api/days`,
      "GET_APPOINTMENTS": `http://localhost:8001/api/appointments`,
      "GET_INTERVIEWERS": `http://localhost:8001/api/interviewers`
    }

    Promise.all([
      axios.get(routes.GET_DAYS),
      axios.get(routes.GET_APPOINTMENTS)
    ]).then(all => {
      setState(prev => ({...prev, days: all[0].data, appointments: all[1].data}));
    })
  }, []);

  dailyAppointments = getAppointmentsForDay(state, state.day)

  const appointmentsArray = dailyAppointments.map(appointment => {
    return <Appointment 
      key = {appointment.id}
      {...appointment}
    />
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
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
