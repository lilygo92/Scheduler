export function getAppointmentsForDay(state, day) {
  const result = []
  const appointments = {...state.appointments};
  let dayAppointments = []
  
  state.days.map(obj => {
    if (obj.name === day) {
      dayAppointments = obj.appointments;
    }
  });

  for (const elem of Object.values(appointments)) {
    if (dayAppointments.includes(elem.id)) {
      result.push(elem);
    }
  }

  return result;
}

export function getInterview(state, interview) {
  if (!interview) {
    return null;
  }

  const result = {};

  for (const key in state.interviewers) {
    if (state.interviewers[key].id === interview.interviewer) {
      result.student = interview.student;
      result.interviewer = state.interviewers[key];
      return result;
    }
  }

  return null;
}

export function getInterviewersForDay(state, day) {
  const result = []
  const interviewers = {...state.interviewers};
  let dayInterviewers = []
  
  state.days.map(obj => {
    if (obj.name === day) {
      dayInterviewers = obj.interviewers;
    }
  });

  for (const elem of Object.values(interviewers)) {
    if (dayInterviewers.includes(elem.id)) {
      result.push(elem);
    }
  }

  return result;
};