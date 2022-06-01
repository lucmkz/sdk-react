import React from "react";
import { render } from "@testing-library/react";

import CardForm from "./CardForms";

describe("Button", () => {
  test("renders the Button component", () => {
    render(<CardForm />);
  });
});