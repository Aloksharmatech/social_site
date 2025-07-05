import { configureStore } from '@reduxjs/toolkit'
import authReducer from "../store/auth/auth-slice"
import suggestedUsersReducer from "./user/suggestedUser-slice"
import userProfileReducer from "./user/userProfile-slice"
import followUnfollowReducer from "./user/followUnfollow-slice"
import userFollowersReducer from "./user/userFollower-slice"
import userFollowingReducer from "./user/userFollowing-slice"
import pickRequestReducer from "./pickRequest/pickRequest-slice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        suggestion: suggestedUsersReducer,
        userProfile: userProfileReducer,
        followUnfolow:followUnfollowReducer,
        userFollowers: userFollowersReducer,
        userFollowing: userFollowingReducer,
        pickRequest:pickRequestReducer,

    },
})