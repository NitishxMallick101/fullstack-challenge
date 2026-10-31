import { gql } from "@apollo/client";

export const GET_CARS = gql`
  query GetCars($model: String) {
    cars(model: $model) {
      id
      make
      model
      year
      color
      mobile
      tablet
      desktop
    }
  }
`;

export type GetCarsData = {
  cars: import("@/features/cars/types/car").Car[];
};

export type GetCarsVariables = {
  model?: string | null;
};
