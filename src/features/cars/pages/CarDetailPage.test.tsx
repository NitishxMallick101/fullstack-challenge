import { ApolloProvider } from "@apollo/client";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { graphql, HttpResponse } from "msw";
import { apolloClient } from "@/lib/apollo";
import { db } from "@/mocks/db";
import { server } from "@/mocks/server";
import { CarsDetailPage } from "@/features/cars/pages/CarDetailPage";

function renderDetailPage(path = "/cars/1") {
  return render(
    <ApolloProvider client={apolloClient}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/cars/:id" element={<CarsDetailPage />} />
          <Route path="/cars" element={<h1>Inventory</h1>} />
        </Routes>
      </MemoryRouter>
    </ApolloProvider>
  );
}

beforeAll(() => server.listen({ onUnhandledRequest: "error" }));
beforeEach(() => {
  db.reset();
  apolloClient.cache.reset();
});
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("CarsDetailPage", () => {
  it("shows loading content before rendering the car details", async () => {
    renderDetailPage();

    expect(
      screen.getByRole("status", { name: "Loading vehicle details" })
    ).toBeInTheDocument();
    expect(
      await screen.findByRole("heading", { name: "Audi Q5", level: 1 })
    ).toBeInTheDocument();
    expect(screen.getByText("Glacier White")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "2023 Audi Q5" })).toHaveAttribute(
      "src",
      "/images/q5-desktop.svg"
    );
  });

  it("shows an error and retries the failed request", async () => {
    const user = userEvent.setup();
    let attempts = 0;
    server.use(
      graphql.query("GetCar", ({ variables }) => {
        attempts += 1;
        if (attempts === 1) {
          return HttpResponse.json({
            errors: [{ message: "Vehicle service unavailable" }],
          });
        }

        const car = db.list().find((item) => item.id === variables.id) ?? null;
        return HttpResponse.json({ data: { car } });
      })
    );
    renderDetailPage();

    expect(
      await screen.findByText(
        "Could not load this vehicle: Vehicle service unavailable"
      )
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(
      await screen.findByRole("heading", { name: "Audi Q5", level: 1 })
    ).toBeInTheDocument();
    expect(attempts).toBe(2);
  });

  it("offers a route back to inventory for an unknown vehicle", async () => {
    renderDetailPage("/cars/unknown");

    expect(
      await screen.findByRole("heading", { name: "Vehicle not found" })
    ).toBeInTheDocument();
    await userEvent.click(screen.getByRole("link", { name: "Browse inventory" }));
    expect(screen.getByRole("heading", { name: "Inventory" })).toBeInTheDocument();
  });
});
