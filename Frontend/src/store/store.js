import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../store/auth/auth-slice"
import suggestedUsersReducer from "./user/suggestedUser-slice"
import userProfileReducer from "./user/user-slice"
import followUnfollowReducer from "./user/followUnfollow-slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        suggestion: suggestedUsersReducer,
        userProfile: userProfileReducer,
        followUnfolow:followUnfollowReducer

    },
})