import { useMutation, useQuery } from "@tanstack/react-query";
import { USER_WISHLIST } from "../../react-keys/querykeys";
import { useGlobalHooks } from "@/hooks/globalHook";
import addtoWishlistAndRemoveWishlist from "@/api/functions/wishlist/addtoWishlistAndRemoveWishlist";
import getWishlist from "@/api/functions/wishlist/getWishList";

const useAddtoCartAndRemoveWishlist = () => {
  const { queryClient } = useGlobalHooks();
  return useMutation({
    mutationFn: (id: string) => addtoWishlistAndRemoveWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [USER_WISHLIST] });
    },
  });
};

const useUserWishlist = () => {
  return useQuery({
    queryKey: [USER_WISHLIST],
    queryFn: () => getWishlist(),
    staleTime: 1000 * 60 * 15,
  });
};

export { useAddtoCartAndRemoveWishlist, useUserWishlist };
