import React from "react";

// Component for displaying empty appointments
export default function Empty(props) {
  return <main className="appointment__add" >
    <img
      className="appointment__add-button"
      src="images/add.png"
      alt="Add"
      onClick={props.onAdd}
    />
  </main>
};