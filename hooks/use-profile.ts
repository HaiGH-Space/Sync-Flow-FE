'use client'

import { userService } from "@/lib/api/user"
import { useUserStore } from "@/lib/store/use-user-profile"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"

export const useProfile = () => {
    const { userProfile, setUserProfile, token } = useUserStore()

    const query = useQuery({
        queryKey: ['userProfile'],
        queryFn: async () => {
            const response = await userService.getUserProfile()
            return response.data
        },
        initialData: (userProfile && token) ? userProfile : undefined,
        staleTime: 1000 * 60 * 10,
    })

    useEffect(() => {
        if (query.data) {
            setUserProfile(query.data);
        }
    }, [query.data, setUserProfile]);

    return query
}