import { render, screen } from "@testing-library/react";
import { CarCard } from "@/features/cars/components/CarCard";
import type { Car } from "@/features/cars/types/car";

const car: Car = {
  id: "42",
  make: "Audi",
  model: "Q5",
  year: 2023,
  color: "Glacier White",
  mobile: "/images/q5-mobile.svg",
  tablet: "/images/q5-tablet.svg",
  desktop: "/images/q5-desktop.svg",
};

describe("CarCard", () => {
  it("shows vehicle details and provides an image for each breakpoint", () => {
    const { container } = render(<CarCard car={car} />);

    expect(
      screen.getByRole("heading", { name: "Q5", level: 2 })
    ).toBeInTheDocument();
    expect(screen.getByText("Audi")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("Glacier White")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "2023 Audi Q5" })).toHaveAttribute(
      "src",
      car.desktop
    );

    const sources = container.querySelectorAll("picture source");
    expect(sources[0]).toHaveAttribute("media", "(max-width: 639px)");
    expect(sources[0]).toHaveAttribute("srcset", car.mobile);
    expect(sources[1]).toHaveAttribute(
      "media",
      "(min-width: 640px) and (max-width: 1023px)"
    );
    expect(sources[1]).toHaveAttribute("srcset", car.tablet);
  });
});
