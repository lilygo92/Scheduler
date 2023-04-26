import React, { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const setDay = day => setState({ ...state, day });

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })


  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    setState({
      ...state,
      appointments
    });

    return axios.put(`/api/appointments/${id}`, { interview })
  }

  function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    
    setState({
      ...state,
      appointments
    });

    return axios.delete(`/api/appointments/${id}`)
  }

  useEffect(() => {
    const routes = {
      "GET_DAYS":     `http://localhost:8001/api/days`,
      "GET_APPOINTMENTS": `http://localhost:8001/api/appointments`,
      "GET_INTERVIEWERS": `http://localhost:8001/api/interviewers`
    }

    Promise.all([
      axios.get(routes.GET_DAYS),
      axios.get(routes.GET_APPOINTMENTS),
      axios.get(routes.GET_INTERVIEWERS)
    ]).then(all => {
      setState(prev => ({
        ...prev, 
        days: all[0].data, 
        appointments: all[1].data, 
        interviewers: all[2].data
      }));
    })
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
