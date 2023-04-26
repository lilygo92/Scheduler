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
  const {interview } = props|| {};
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )

  const save = function(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };

    transition(SAVING);
    props.bookInterview(props.id, interview)
      .then(() => transition(SHOW))
      .catch(error => transition(ERROR_SAVE, true));
  }

  const cancel = function() {
    transition(DELETING, true);
    props.cancelInterview(props.id)
      .then(() => transition(EMPTY))
      .catch(error => transition(ERROR_DELETE, true));
  };

  return <article className="appointment">
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
    {mode === SAVING && <Status message="Confirming" />}
    {mode === CONFIRM && (
      <Confirm
        message="Are you sure you would like to delete?"
        onCancel={back}
        onConfirm={cancel}
      />
      )}
    {mode === ERROR_SAVE && (
      <Error 
      message={"Could not book appointment"} 
      onClose={back}
    />
    )}
    {mode === ERROR_DELETE && (
      <Error 
      message={"Could not delete appointment"} 
      onClose={back}
    />
    )}
  </article>
}