import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link as RouterLink, useParams } from "react-router-dom";
import { useCar } from "@/features/cars/hooks/useCar";

export function CarsDetailPage() {
  const { id } = useParams();
  const { car, loading, error, refetch } = useCar(id);

  return (
    <Box minHeight="100vh" pb={8}>
      <Box
        sx={{
          color: "common.white",
          background:
            "linear-gradient(115deg, #10243d 0%, #173c60 60%, #23618b 100%)",
          pt: { xs: 3, md: 5 },
          pb: { xs: 10, md: 14 },
        }}
      >
        <Container maxWidth="lg">
          <Button
            component={RouterLink}
            to="/cars"
            startIcon={<ArrowBackIcon />}
            color="inherit"
            sx={{ mb: 3, ml: -1 }}
          >
            Back to inventory
          </Button>
          <Typography
            variant="overline"
            sx={{ display: "block", color: "rgba(255,255,255,.72)", letterSpacing: ".16em" }}
          >
            VEHICLE DETAILS
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              mt: 0.5,
              fontSize: { xs: "2.5rem", md: "3.75rem" },
              fontWeight: 700,
            }}
          >
            {car ? `${car.make} ${car.model}` : "Discover your next drive"}
          </Typography>
          {car && (
            <Typography variant="h6" sx={{ color: "rgba(255,255,255,.78)" }}>
              {car.year} · {car.color}
            </Typography>
          )}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: { xs: -7, md: -9 }, position: "relative" }}>
        {loading ? (
          <Paper
            aria-label="Loading vehicle details"
            role="status"
            variant="outlined"
            sx={{ overflow: "hidden", borderColor: "divider" }}
          >
            <Skeleton
              variant="rectangular"
              sx={{ height: { xs: 230, md: 440 } }}
            />
            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
              <Skeleton width="35%" height={42} />
              <Skeleton width="55%" />
              <Skeleton width="45%" />
            </Box>
          </Paper>
        ) : error ? (
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => void refetch()}
              >
                Retry
              </Button>
            }
          >
            Could not load this vehicle: {error.message}
          </Alert>
        ) : !car ? (
          <Paper variant="outlined" sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
            <Typography variant="h5" component="h2" gutterBottom>
              Vehicle not found
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 2 }}>
              This vehicle may have been removed or the link may be incorrect.
            </Typography>
            <Button component={RouterLink} to="/cars" variant="contained">
              Browse inventory
            </Button>
          </Paper>
        ) : (
          <Paper
            component="article"
            variant="outlined"
            sx={{ overflow: "hidden", borderColor: "divider" }}
          >
            <picture>
              <source media="(max-width: 639px)" srcSet={car.mobile} />
              <source
                media="(min-width: 640px) and (max-width: 1023px)"
                srcSet={car.tablet}
              />
              <img
                src={car.desktop}
                alt={`${car.year} ${car.make} ${car.model}`}
                style={{
                  display: "block",
                  width: "100%",
                  aspectRatio: "16 / 9",
                  objectFit: "cover",
                }}
              />
            </picture>

            <Box sx={{ p: { xs: 2.5, md: 4 } }}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
                mb={3}
              >
                <Box>
                  <Typography variant="overline" color="text.secondary">
                    {car.make}
                  </Typography>
                  <Typography variant="h3" component="h2" fontWeight={700}>
                    {car.model}
                  </Typography>
                </Box>
                <Chip
                  label={`${car.year} model`}
                  color="primary"
                  variant="outlined"
                />
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={{ xs: 2, sm: 6 }}
                divider={
                  <Box
                    sx={{
                      borderBottom: { xs: 1, sm: 0 },
                      borderRight: { xs: 0, sm: 1 },
                      borderColor: "divider",
                    }}
                  />
                }
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    MODEL YEAR
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {car.year}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    EXTERIOR COLOR
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {car.color}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
