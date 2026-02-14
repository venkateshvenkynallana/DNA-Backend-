import User from "../../models/User.js";


const blockUser = async( req, res) => {
    try {
        const {id} = req.params;

        if(!id){
            return res.status(400).json({message: "User Id wrong"})
        }

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({message : "User not found"})
        }

        user.status = user.status === "verified" ? "blocked" : "verified";

        await user.save();

        res.status(200).json({message: `User has been ${user.status === "verified" ? "unblocked" : "blocked"} successfully`})

    } catch (error) {
        console.log("Error in blockUser.js", error.message);
        res.status(500).json({message: "Internal Server Error! unable to block user"})
    }
}

export default blockUser;