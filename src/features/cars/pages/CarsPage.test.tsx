import { graphql, HttpResponse } from "msw";
import userEvent from "@testing-library/user-event";
import { server } from "@/mocks/server";
import { db } from "@/mocks/db";
import { apolloClient } from "@/lib/apollo";
import { renderWithProviders, screen } from "@/test/renderWithProviders";
import { CarsPage } from "@/features/cars/pages/CarsPage";

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  db.reset();
  apolloClient.cache.reset();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("CarsPage", () => {
  it("shows a loading state while the inventory is requested", () => {
    renderWithProviders(<CarsPage />);

    expect(screen.getByRole("status", { name: "Loading vehicles" })).toBeInTheDocument();
  });

  it("shows an empty state when the search has no matches", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CarsPage />);

    expect(
      await screen.findByText("6 vehicles available")
    ).toBeInTheDocument();
    await user.type(
      screen.getByRole("textbox", { name: "Search model" }),
      "no-such-model"
    );
    expect(
      await screen.findByText(
        "No vehicles match “no-such-model”. Try another model."
      )
    ).toBeInTheDocument();
  });

  it("shows a useful message when the inventory request fails", async () => {
    server.use(
      graphql.query("GetCars", () =>
        HttpResponse.json({ errors: [{ message: "Inventory unavailable" }] })
      )
    );
    renderWithProviders(<CarsPage />);

    expect(
      await screen.findByText(
        "Could not load vehicles: Inventory unavailable"
      )
    ).toBeInTheDocument();
  });
});
