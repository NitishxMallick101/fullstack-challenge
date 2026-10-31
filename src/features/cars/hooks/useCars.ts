import { useMutation, useQuery } from "@apollo/client";
import { CREATE_CAR, type CreateCarData, type CreateCarVariables } from "@/features/cars/api/create-car";
import { GET_CARS, type GetCarsData, type GetCarsVariables } from "@/features/cars/api/get-cars";
import type { CreateCarInput } from "@/features/cars/types/car";

export function useCars(model = "") {
  const normalizedModel = model.trim();
  const queryVariables = { model: normalizedModel || null };
  const { data, loading, error, refetch } = useQuery<
    GetCarsData,
    GetCarsVariables
  >(GET_CARS, { variables: queryVariables });
  const [
    runCreateCar,
    { loading: creating, error: createError },
  ] = useMutation<CreateCarData, CreateCarVariables>(CREATE_CAR, {
    refetchQueries: [{ query: GET_CARS, variables: queryVariables }],
    awaitRefetchQueries: true,
  });

  const createCar = async (input: CreateCarInput) => {
    try {
      await runCreateCar({ variables: { input } });
      return true;
    } catch {
      return false;
    }
  };

  return {
    cars: data?.cars ?? [],
    loading,
    error,
    refetch,
    createCar,
    creating,
    createError,
  };
}
