import { useState } from "react";
import userEvent from "@testing-library/user-event";
import { server } from "@/mocks/server";
import { db } from "@/mocks/db";
import { renderWithProviders, screen } from "@/test/renderWithProviders";
import { useCars } from "@/features/cars/hooks/useCars";

function CarsHarness() {
  const [model, setModel] = useState("");
  const { cars, loading, error, createCar } = useCars(model);

  return (
    <div>
      <label>
        Model filter
        <input value={model} onChange={(event) => setModel(event.target.value)} />
      </label>
      {loading && <p>Loading cars</p>}
      {error && <p>Could not load cars: {error.message}</p>}
      <p>{cars.map((car) => car.model).join(", ")}</p>
      <button
        type="button"
        onClick={() =>
          void createCar({
            make: "Test",
            model: "Integration Model",
            year: 2026,
            color: "Blue",
            mobile: "/images/q5-mobile.svg",
            tablet: "/images/q5-tablet.svg",
            desktop: "/images/q5-desktop.svg",
          })
        }
      >
        Create test car
      </button>
    </div>
  );
}

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
afterEach(() => {
  server.resetHandlers();
  db.reset();
});
afterAll(() => server.close());

describe("useCars", () => {
  it("loads cars, filters through the API, and refreshes after creation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsHarness />);

    expect(await screen.findByText(/Q5, A3, R8/)).toBeInTheDocument();
    await user.type(screen.getByRole("textbox", { name: "Model filter" }), "Q5");
    expect(await screen.findByText("Q5")).toBeInTheDocument();

    await user.clear(screen.getByRole("textbox", { name: "Model filter" }));
    expect(await screen.findByText(/Q5, A3, R8/)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Create test car" }));
    expect(await screen.findByText(/Integration Model/)).toBeInTheDocument();
  });
});
