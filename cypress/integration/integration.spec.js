describe("Appointments", () => {
  beforeEach(() => {
    cy.request("GET", "/api/debug/reset");
    cy.visit("/");
    cy.contains("Monday");
  });

  it("should book an interview", () => {
    cy.get("[alt=Add]").first().click();

    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Lydia Miller-Jones");
    cy.contains(".appointment__card--show", "Sylvia Palmer");
  });

  it("should edit an interview", () => {
    cy.get("[alt=Add]").first().click();

    cy.get("[data-testid=student-name-input]").type("Lydia Miller-Jones");
    cy.get("[alt='Sylvia Palmer']").click();
    cy.contains("Save").click();

    cy.contains(".appointment__card--show", "Sylvia Palmer");
    cy.contains(".appointment__card--show", "Lydia Miller-Jones")
      .get("[alt=Edit]:last")
      .click({ force: true });

    cy.get("[data-testid=student-name-input]").clear().type("Robin Hood");
    cy.get("[alt='Tori Malcolm']").click();
    cy.contains("Save").click();
  });

  it("should cancel an interview", () => {
    cy.get("[alt=Delete]").first().click({ force: true });

    cy.contains("button", "Confirm").click();
    cy.contains(".appointment__card", "Deleting");
    cy.get(".schedule > :nth-child(1)").should("not.contain", "Deleting");

    cy.get(".schedule").should("not.contain", "Archie Cohen");
  });
});