import { useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Container,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { CarCard } from "@/features/cars/components/CarCard";
import { CarForm } from "@/features/cars/components/CarForm";
import { useCars } from "@/features/cars/hooks/useCars";

export function CarsPage() {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const {
    cars,
    loading,
    error,
    refetch,
    createCar,
    creating,
    createError,
  } = useCars(search);

  const sortedCars = useMemo(
    () =>
      [...cars].sort((a, b) =>
        sortOrder === "newest" ? b.year - a.year : a.year - b.year
      ),
    [cars, sortOrder]
  );

  return (
    <Box minHeight="100vh" pb={8}>
      <Box
        sx={{
          color: "common.white",
          background:
            "linear-gradient(115deg, #10243d 0%, #173c60 60%, #23618b 100%)",
          pt: { xs: 5, md: 8 },
          pb: { xs: 9, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="overline"
            sx={{ color: "rgba(255,255,255,.72)", letterSpacing: ".16em" }}
          >
            AUDI MOTOR GROUP
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{ mt: 1, fontSize: { xs: "2.5rem", md: "3.75rem" }, fontWeight: 700 }}
          >
            Find your next ride.
          </Typography>
          <Typography
            variant="body1"
            sx={{ mt: 1, color: "rgba(255,255,255,.78)" }}
          >
            Explore the collection and add a vehicle to your inventory.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -5, md: -7 }, position: "relative" }}>
        <Stack spacing={4}>
          <CarForm onCreate={createCar} creating={creating} />

          <Box component="section" aria-labelledby="inventory-title">
            <Stack
              direction={{ xs: "column", sm: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "stretch", sm: "flex-end" }}
              spacing={2}
              mb={2.5}
            >
              <Box>
                <Typography id="inventory-title" variant="h4" component="h2">
                  The collection
                </Typography>
                <Typography color="text.secondary">
                  {loading
                    ? "Loading available vehicles…"
                    : `${cars.length} ${cars.length === 1 ? "vehicle" : "vehicles"} available`}
                </Typography>
              </Box>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                <TextField
                  label="Search model"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  size="small"
                  sx={{ minWidth: { sm: 220 }, bgcolor: "background.paper" }}
                  inputProps={{ "aria-label": "Search model" }}
                />
                <TextField
                  select
                  label="Sort by year"
                  value={sortOrder}
                  onChange={(event) => setSortOrder(event.target.value)}
                  size="small"
                  sx={{ minWidth: 160, bgcolor: "background.paper" }}
                  inputProps={{ "aria-label": "Sort by year" }}
                >
                  <MenuItem value="newest">Newest first</MenuItem>
                  <MenuItem value="oldest">Oldest first</MenuItem>
                </TextField>
              </Stack>
            </Stack>

            {createError && (
              <Alert severity="error" sx={{ mb: 2 }} role="alert">
                Could not add vehicle: {createError.message}
              </Alert>
            )}

            {error ? (
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={() => void refetch()}>
                    Retry
                  </Button>
                }
              >
                Could not load vehicles: {error.message}
              </Alert>
            ) : loading ? (
              <Box
                aria-label="Loading vehicles"
                role="status"
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {Array.from({ length: 3 }, (_, index) => (
                  <Skeleton key={index} variant="rounded" height={280} />
                ))}
              </Box>
            ) : sortedCars.length === 0 ? (
              <Alert severity="info">
                {search.trim()
                  ? `No vehicles match “${search.trim()}”. Try another model.`
                  : "There are no vehicles in the inventory yet."}
              </Alert>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "repeat(2, minmax(0, 1fr))",
                    md: "repeat(3, minmax(0, 1fr))",
                  },
                  gap: 2,
                }}
              >
                {sortedCars.map((car) => (
                  <CarCard key={car.id} car={car} />
                ))}
              </Box>
            )}
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}
