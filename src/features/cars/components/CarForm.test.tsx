import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CarForm } from "@/features/cars/components/CarForm";

describe("CarForm", () => {
  it("submits a trimmed vehicle and resets after successful creation", async () => {
    const user = userEvent.setup();
    const onCreate = jest.fn().mockResolvedValue(true);
    render(<CarForm onCreate={onCreate} creating={false} />);

    await user.type(screen.getByRole("textbox", { name: "Make" }), "  Audi  ");
    await user.type(screen.getByRole("textbox", { name: "Model" }), " A8 ");
    await user.clear(screen.getByRole("spinbutton", { name: "Year" }));
    await user.type(screen.getByRole("spinbutton", { name: "Year" }), "2024");
    await user.type(
      screen.getByRole("textbox", { name: "Color" }),
      "  Black  "
    );
    await user.click(screen.getByRole("button", { name: "Add vehicle" }));

    await waitFor(() =>
      expect(onCreate).toHaveBeenCalledWith({
        make: "Audi",
        model: "A8",
        year: 2024,
        color: "Black",
        mobile: "/images/q5-mobile.svg",
        tablet: "/images/q5-tablet.svg",
        desktop: "/images/q5-desktop.svg",
      })
    );
    expect(screen.getByRole("textbox", { name: "Make" })).toHaveValue("");
    expect(screen.getByRole("textbox", { name: "Model" })).toHaveValue("");
  });
});
