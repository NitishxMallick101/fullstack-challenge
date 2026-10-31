import { useState, type FormEvent } from "react";
import { Button, Paper, Stack, TextField, Typography } from "@mui/material";
import type { CreateCarInput } from "@/features/cars/types/car";

const placeholderImages = {
  mobile: "/images/q5-mobile.svg",
  tablet: "/images/q5-tablet.svg",
  desktop: "/images/q5-desktop.svg",
};

type CarFormProps = {
  onCreate: (input: CreateCarInput) => Promise<boolean>;
  creating: boolean;
};

export function CarForm({ onCreate, creating }: CarFormProps) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState(String(new Date().getFullYear()));
  const [color, setColor] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const created = await onCreate({
      make: make.trim(),
      model: model.trim(),
      year: Number(year),
      color: color.trim(),
      ...placeholderImages,
    });

    if (created) {
      setMake("");
      setModel("");
      setYear(String(new Date().getFullYear()));
      setColor("");
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      variant="outlined"
      aria-labelledby="add-car-title"
      sx={{ p: { xs: 2, sm: 3 }, borderColor: "divider" }}
    >
      <Stack spacing={2}>
        <div>
          <Typography id="add-car-title" variant="h6" component="h2">
            Add a vehicle
          </Typography>
          <Typography variant="body2" color="text.secondary">
            New vehicles use the provided Q5 placeholder images.
          </Typography>
        </div>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <TextField
            label="Make"
            value={make}
            onChange={(event) => setMake(event.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Model"
            value={model}
            onChange={(event) => setModel(event.target.value)}
            required
            fullWidth
            size="small"
          />
          <TextField
            label="Year"
            type="number"
            value={year}
            onChange={(event) => setYear(event.target.value)}
            required
            inputProps={{ min: 1886, max: 2100 }}
            fullWidth
            size="small"
          />
          <TextField
            label="Color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
            required
            fullWidth
            size="small"
          />
        </Stack>
        <Button
          type="submit"
          variant="contained"
          disabled={creating}
          sx={{ alignSelf: "flex-start", px: 3 }}
        >
          {creating ? "Adding…" : "Add vehicle"}
        </Button>
      </Stack>
    </Paper>
  );
}
