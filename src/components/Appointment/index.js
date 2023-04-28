import React from "react";
import "./styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";
import useVisualMode from "hooks/useVisualMode";
import axios from "axios";

export default function Appointment(props) {
  const EMPTY = "EMPTY";
  const SHOW = "SHOW";
  const CREATE = "CREATE";
  const SAVING = "SAVING";
  const CONFIRM = "CONFIRM";
  const DELETING = "DELETING";
  const EDIT = "EDIT";
  const ERROR_DELETE = "ERROR_DELETE";
  const ERROR_SAVE = "ERROR_SAVE";

  const interviewers = props.interviewers;
  const { interview } = props|| {};
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  // transition to saving mode
  // send a put request to the url that corresponds to the id of the appointment
  // book the interview and transition to show mode
  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    axios
      .put(`/api/appointments/${props.id}`, { interview })
      .then(() => {
        props.bookInterview(props.id, interview)
        transition(SHOW)
      })
      .catch(error => transition(ERROR_SAVE, true));
  }

  // transition to deleting mode
  // send a delete request to the url that corresponds to the id of the appointment
  // delete the interview and transition to empty mode
  const cancel = function() {
    transition(DELETING, true);
    axios
      .delete((`/api/appointments/${props.id}`))
      .then(() => {
        props.cancelInterview(props.id)
        transition(EMPTY)}
      )
      .catch(error => transition(ERROR_DELETE, true));
  };

  return <article className="appointment" data-testid="appointment">
    <Header
      time = {props.time}
    />
    {mode === EMPTY && <Empty onAdd={() => {transition(CREATE)}} />}
    {mode === SHOW && interview && (
      <Show
        student={interview.student}
        interviewer={interview.interviewer}
        onEdit={() => transition(EDIT)}
        onDelete={() => {transition(CONFIRM)}}
      />
    )}
    {mode === CREATE && (
      <Form 
        interviewers={interviewers} 
        onCancel={back} 
        onSave={save} 
      />)}
    {mode === EDIT && (
      <Form 
        student={interview.student}
        interviewer={interview.interviewer}
        interviewers={interviewers} 
        onCancel={back} 
        onSave={save}
    />)}
    {mode === DELETING && <Status message="Deleting" />}
    {mode === SAVING && <Status message="Saving" />}
    {mode === CONFIRM && (
      <Confirm
        message="Are you sure you would like to delete?"
        onCancel={back}
        onConfirm={cancel}
      />
      )}
    {mode === ERROR_SAVE && (
      <Error 
      message={"Error saving appointment"} 
      onClose={back}
    />
    )}
    {mode === ERROR_DELETE && (
      <Error 
      message={"Error deleting appointment"} 
      onClose={back}
    />
    )}
  </article>
}