import { useMutation, useQuery } from "@tanstack/react-query";
import { USER_CART } from "../../react-keys/querykeys";
import getCart from "@/api/functions/cart/getCart";
import addtoCartAndRemoveCart from "@/api/functions/cart/addtoCartAndRemoveCart";
import { useGlobalHooks } from "@/hooks/globalHook";

const useAddtoCartAndRemoveCart = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: (id: string) => addtoCartAndRemoveCart(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_CART] });
    },
  });
};

const useUserCart = () => {
  return useQuery({
    queryKey: [USER_CART],
    queryFn: () => getCart(),
    staleTime: 1000 * 60 * 15,
  });
};

export { useAddtoCartAndRemoveCart, useUserCart };
