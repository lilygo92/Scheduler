import React from "react";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText,
  prettyDOM,
  getAllByTestId,
  getByAltText,
  getByTestId,
  getByPlaceholderText,
  waitForElementToBeRemoved,
  queryByText,
  getByDisplayValue,
  act,
} from "@testing-library/react";
import axios from "axios";
import Application from "components/Application";

afterEach(cleanup);

describe("Application component", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", () => {
    const { getByText } = render(<Application />);

    return waitForElement(() => getByText("Monday"))
    .then(() => {
      fireEvent.click(getByText("Tuesday"));
      expect(getByText("Leopold Silvers")).toBeInTheDocument();
    });
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
  
    await waitForElement(() => getByText(container, "Archie Cohen"));
  
    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];
    
    fireEvent.click(getByAltText(appointment, "Add"));
  
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
  
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
  
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
  
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));
  
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
  
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Delete" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find((el) =>
      queryByText(el, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, /delete/i));
    // 4. Check that the confirmation message is shown.
    expect(
      getByText(appointment, /Are you sure you would like to delete?/i)
    ).toBeInTheDocument();
    // 5. Click the "Confirm" button on the confirmation.
    fireEvent.click(getByText(appointment, /confirm/i));
    // 6. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();
    // 7. Wait until the element with the "Add" button is displayed.
    await waitForElementToBeRemoved(() =>
      queryByText(appointment, /deleting/i)
    );
    // 8. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find((el) =>
      queryByText(el, /monday/i)
    );
    expect(getByText(day, /2 spots remaining/i)).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    // 3. Click the "Edit" button on the booked appointment.
    const appointment = getAllByTestId(container, "appointment").find((el) =>
      queryByText(el, "Archie Cohen")
    );
    fireEvent.click(getByAltText(appointment, /edit/i));
    //check that initial value of student input is correct
    expect(getByDisplayValue(appointment, "Archie Cohen")).toBeInTheDocument();
    //edit the student value and the selected interviewer and click the save button
    fireEvent.change(getByTestId(appointment, "student-name-input"), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));
    //check that the saving confirmation shows
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();
    //wait for the show page and confirm that the correct info shows
    await waitForElementToBeRemoved(() => getByText(appointment, /saving/i));
    expect(getByText(appointment, "Sylvia Palmer")).toBeInTheDocument();
    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    //check that the spots remaining has remained the same
    const day = getAllByTestId(container, "day").find((el) =>
      queryByText(el, /monday/i)
    );
    expect(getByText(day, /1 spot remaining/i)).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.change(getByTestId(appointment, "student-name-input"), {
      target: { value: "Lydia Miller-Jones" },
    });
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, /saving/i)).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, /Error Saving Appointment/i)
    );
    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByText(appointment, /interviewer/i)).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment").find((el) =>
      queryByText(el, "Archie Cohen")
    );

    fireEvent.click(getByAltText(appointment, /delete/i));
    expect(
      getByText(appointment, /Are you sure you would like to delete?/i)
    ).toBeInTheDocument();

    fireEvent.click(getByText(appointment, /confirm/i));
    expect(getByText(appointment, /deleting/i)).toBeInTheDocument();

    await waitForElementToBeRemoved(() =>
      getByAltText(appointment, /Loading/i)
    );

    fireEvent.click(getByAltText(appointment, /close/i));

    expect(getByText(appointment, /Archie Cohen/i)).toBeInTheDocument();
  });
});