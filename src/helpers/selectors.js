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

  console.log(result);
  return result;
}
