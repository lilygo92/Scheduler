import React from "react";
import "./styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

export default function Appointment(props) {
  let interview = props.interview ? <Show interviewer = {props.interview.interviewer} student = {props.interview.student} /> : <Empty />

  return <article className="appointment">
    <Header
      time = {props.time}
    />
    {interview}
  </article>
}