import { decodeToken } from "../lib/utils.js";
import Like from "../models/Likes.js";


export const likeUserProfile = async (req, res) => {
    try {
        const { userId } = decodeToken(req);
        const likedBy = userId
        const likedTo = req.params.userId;
        console.log("likedByuser", likedBy)
        const existing = await Like.findOne({
            likedBy,
            likedTo
        })
        if (existing) {
            const likedId = `${likedBy}_._${likedTo}`;
            await Like.deleteOne({
                _id: likedId
            })
            return res.status(200).json({ message: "DisLiked successfully" })
        }
        const like = new Like({
            _id: `${likedBy}_._${likedTo}`,
            likedBy,
            likedTo
        })
        console.log("likeddatacontroller", like)
        const likeData = await like.save();
        res.status(200).json({
            success: true,
            data: likeData
        })
    } catch (error) {
        console.log("error in like", error);
        res.status(500).json({ message: "Internal Server Error. colud not like..!" });
    }
}

//get likes count
// export const getProfileLikes = async (req, res) => {
//     try {
//         const { userId } = decodeToken(req);
//         const likedBy = userId;
//         const likedTo = req.params.userId;

//         const totalLikes = await Like.countDocuments({
//             likedTo: likedTo
//         })

//         const likeId = `${likedBy}_._${likedTo}`
//         console.log("likeid coming", likeId)
//         const liked = await Like.findById(likeId);
//         res.status(200).json({
//             success: true,
//             data: {
//                 totalLikes,
//                 data: liked
//             }
//         })
//     } catch (error) {
//         console.log("get like view profile error ", error)
//         res.status(500).json({ message: "Internal Server Error" });
//     }
// }

// export const deleteLike = async (req, res) => {
//     try {
//         const { userId } = decodeToken(req);
//         const likedBy = userId;
//         const likedTo = req.params.userId;

//         const likedId = `${likedBy}_._${likedTo}`;
//         console.log("likedId", likedId);
//         const removeLikeId = await Like.deleteOne({
//             _id: likedId
//         });
//         res.status(200).json({
//             success: true,
//             data: removeLikeId
//         })
//     } catch (error) {
//         console.log("remove the like error:- ", error)
//         res.status(500).json({ message: "Internal Server Error Remove Like" });
//     }
// }