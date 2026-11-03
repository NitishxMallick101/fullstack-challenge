import { useCar } from "@/features/cars/hooks/useCar";
import { apolloClient } from "@/lib/apollo";
import { db } from "@/mocks/db";
import { server } from "@/mocks/server";
import { renderWithProviders, screen } from "@/test/renderWithProviders";
import userEvent from "@testing-library/user-event";
import { graphql, HttpResponse } from "msw";

function CarHarness({ id }: { id: string }) {
  const { car, loading, error, refetch } = useCar(id);

  return (
    <div>
      {loading && <p>Loading car</p>}
      {error && <p role="alert">Could not load car: {error.message}</p>}
      {car ? (
        <p>
          {car.make} {car.model}
        </p>
      ) : (
        !loading && !error && <p>No car found</p>
      )}
      <button type="button" onClick={() => void refetch()}>
        Retry
      </button>
    </div>
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

describe("useCar", () => {
  it("loads a car and trims whitespace from its ID", async () => {
    renderWithProviders(<CarHarness id=" 1 " />);

    expect(screen.getByText("Loading car")).toBeInTheDocument();
    expect(await screen.findByText("Audi Q5")).toBeInTheDocument();
  });

  it("returns no car for an unknown ID", async () => {
    renderWithProviders(<CarHarness id="unknown" />);

    expect(await screen.findByText("No car found")).toBeInTheDocument();
  });

  it("does not show a loading state when the ID is blank", () => {
    renderWithProviders(<CarHarness id="   " />);

    expect(screen.getByText("No car found")).toBeInTheDocument();
    expect(screen.queryByText("Loading car")).not.toBeInTheDocument();
  });

  it("reports a request error and can retry successfully", async () => {
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

    renderWithProviders(<CarHarness id="1" />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Could not load car: Vehicle service unavailable"
    );

    await user.click(screen.getByRole("button", { name: "Retry" }));

    expect(await screen.findByText("Audi Q5")).toBeInTheDocument();
    expect(attempts).toBe(2);
  });
});
