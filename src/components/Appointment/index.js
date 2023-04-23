import React from "react";
import "./styles.scss"
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

export default function Appointment(props) {
  let interview = props.interview ? <Show /> : <Empty />

  return <article className="appointment">
    <Header
      time = {props.time}
    />
    {interview}
  </article>
}