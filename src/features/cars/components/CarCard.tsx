import { Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { Link } from 'react-router-dom';
import type { Car } from "@/features/cars/types/car";

type CarCardProps = {
  car: Car;
};

export function CarCard({ car }: CarCardProps) {
  return (
    <Link to={`/cars/${car.id}`} style={{ textDecoration: 'none' }}>
      <Card
        component="article"
        variant="outlined"
        sx={{
          height: "100%",
          overflow: "hidden",
          borderColor: "divider",
          transition: "transform 160ms ease, box-shadow 160ms ease",
          "&:hover": { transform: "translateY(-3px)", boxShadow: 4 },
        }}
      >
        <picture>
          <source
            media="(max-width: 639px)"
            srcSet={car.mobile}
          />
          <source
            media="(min-width: 640px) and (max-width: 1023px)"
            srcSet={car.tablet}
          />
          <img
            src={car.desktop}
            alt={`${car.year} ${car.make} ${car.model}`}
            style={{ display: "block", width: "100%", aspectRatio: "16 / 9", objectFit: "cover" }}
          />
        </picture>
        <CardContent>
          <Stack spacing={1.5}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-start"
              spacing={1}
            >
              <div>
                <Typography variant="overline" color="text.secondary">
                  {car.make}
                </Typography>
                <Typography variant="h6" component="h2" lineHeight={1.2}>
                  {car.model}
                </Typography>
              </div>
              <Chip label={car.year} size="small" variant="outlined" />
            </Stack>
            <Typography variant="body2" color="text.secondary">
              {car.color}
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    </Link>
);
}
