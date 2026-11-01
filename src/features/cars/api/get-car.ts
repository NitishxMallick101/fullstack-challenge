import { gql } from "@apollo/client";

export const GET_CAR = gql`
  query GetCar($id: ID!) {
    car(id: $id) {
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

export type GetCarData = {
  car: import("@/features/cars/types/car").Car | null;
};

export type GetCarVariables = {
  id: string;
};
