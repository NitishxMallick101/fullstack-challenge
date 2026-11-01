import { useQuery } from "@apollo/client";
import { GET_CAR, type GetCarData, type GetCarVariables } from "@/features/cars/api/get-car";

export function useCar(id = "") {
  const normalizedId = id.trim();
  const queryVariables = { id: normalizedId };
  const { data, loading, error, refetch } = useQuery<
    GetCarData,
    GetCarVariables
  >(GET_CAR, { variables: queryVariables, skip: !normalizedId });

  return {
    car: data?.car ?? null,
    loading,
    error,
    refetch,
  };
}
