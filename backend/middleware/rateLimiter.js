import ratelimit from "../config/upstash.js";

const rateLimiter = async(req, res) => {
    try {
        
        // should use user-id, ip-address; will add later.
        const{success} = await ratelimit.limit("my-rate-limit")

        if(!success) {
            return res.status(429).json({
                message:"Too many requests, please try again later."
            })
        }

        next()

    } catch (error) {
        console.log("Rate limit error", error)
        next(error)
    }
}

export default(rateLimiter)