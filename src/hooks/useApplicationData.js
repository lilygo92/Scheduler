import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const setDay = day => setState({ ...state, day });

  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  })

  const updateSpots = function(state, appointments) {
    let spots = 0;
    const dayObj = state.days.find(d => d.name === state.day);
  
    for (const id of dayObj.appointments) {
      if (!appointments[id].interview) {
        spots++
      }
    }
  
    const day = {...dayObj, spots} 
    return state.days.map(d => d.name === state.day ? day : d) 
  }

  function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    const days = updateSpots(state, appointments);

    return setState({
      ...state,
      days,
      appointments
    })  
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

    const days = updateSpots(state, appointments);
    
    return setState({
      ...state,
      days,
      appointments
    });
  }
  

  useEffect(() => {
    const routes = {
      "GET_DAYS":     `http://localhost:8001/api/days`,
      "GET_APPOINTMENTS": `http://localhost:8001/api/appointments`,
      "GET_INTERVIEWERS": `http://localhost:8001/api/interviewers`
    }
    axios.defaults.baseURL = 'http://localhost:8001/';
    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(all => {
      setState(prev => ({
        ...prev, 
        days: all[0].data, 
        appointments: all[1].data, 
        interviewers: all[2].data
      }));
    })
    .catch(error => error.message)
  }, []);

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
