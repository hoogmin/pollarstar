import bcrypt from "bcrypt";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import Poll from "../models/Poll.js";
import { generateAccessToken, generateRefreshToken } from "../util/token.js";
import { isValidObjectId } from "mongoose";
import axios from "axios";

// Create/Register user from given data.
export const createUser = async (req, res) => {
    let {
        username,
        email,
        password
    } = req.body;

    if (!username || !email || !password) return res.status(400).json({ message: "Invalid body." });

    // Of course, we must hash the password for security.
    let hashedPassword;

    try {
        const salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(password, salt);
    } catch (error) {
        console.error(`Error during hashing: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    // Clear plaintext password from memory, just as a good practice.
    password = null;

    // We can now store the user in the db.
    const newUser = {
        username,
        email,
        password: hashedPassword
    };

    await User.create(newUser)
        .then((user) => {
            console.log(`User created successfully: ${user}`);
            return res.status(201).json({ message: "User created successfully" });
        })
        .catch((error) => {
            console.error(`Error creating user: ${error}`);
            return res.status(500).json({ message: "Internal Server Error" });
        });
}

// Log in user and return their data along with their tokens.
export const loginUser = async (req, res) => {
    const {
        usernameOrEmail,
        password
    } = req.body;

    if (!usernameOrEmail || !password) return res.status(400).json({ message: "Invalid Body." });

    // Find user in db, if found validate credentials and send back JWT token pair.
    let user;

    try {
        user = await User.findOne({
            $or: [
                { username: usernameOrEmail },
                { email: usernameOrEmail }
            ]
        });
    } catch (error) {
        console.error(`Error finding user: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    if (!user) {
        return res.status(401).json({ message: "Could not log user in" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        // User has been authenticated, now create token pair and return success status.
        const userInfo = {
            id: user._id,
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
            profilePic: user.profilePic,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        const accessToken = generateAccessToken(userInfo);
        let refreshToken;

        try {
            refreshToken = await generateRefreshToken(userInfo);
        } catch (error) {
            console.error(`Error generating refreshToken: ${error}`);
            return res.sendStatus(500);
        }

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict", // Lax or Strict
            maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        return res.status(200).json({ accessToken });
    }

    return res.status(401).json({ message: "Could not log user in" });
}

// Clear the login sessions (refresh tokens) for the user.
// This will affect all devices.
export const clearAllSessions = async (req, res) => {
    // Clear all refresh tokens belonging to the user from the db.
    // This is essentially clearing all their 'sessions'.
    try {
        await RefreshToken.deleteMany({
            userId: req.user.id
        });
    } catch (error) {
        console.error(`Error clearing user sessions: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    // Options object must be identical to when created
    // excluding expires and maxAge fields.
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });

    return res.status(200).json({ message: "Cleared sessions." });
}

// Clear current login session for the user.
// This will affect only one device.
export const logoutUser = async (req, res) => {
    // Clear only a single session based on the userId
    // and refreshToken itself.
    try {
        await RefreshToken.deleteMany({
            userId: req.user.id,
            token: req.refreshToken
        });
    } catch (error) {
        console.error(`Error logging out user: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    // Options object must be identical to when created
    // excluding expires and maxAge fields.
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });

    return res.status(200).json({ message: "Cleared current session" });
}

// Get the logged in user's info and return it to them.
export const fetchUserInfo = async (req, res) => {
    let foundUser;

    try {
        foundUser = await User.findById(req.user.id).select("-password").lean();
        foundUser.id = foundUser._id;
        delete foundUser._id;
    } catch (error) {
        console.error(`Failed to fetch user info: ${error}`);
        return res.status(500).json({ message: "Failed to fetch user info." });
    }

    return res.status(200).json(foundUser);
}

// Get stats about the user (Total number of polls created, voted, etc)
export const fetchUserStats = async (req, res) => {
    let stats = {
        pollsCount: 0
    };

    try {
        stats.pollsCount = await Poll.countDocuments({
            owner: req.user.id
        });
    } catch (error) {
        console.error(`Error fetching user stats: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    return res.status(200).json(stats);
}

// Using the refresh token from the request, refresh the given user's
// session by returning a new access token to them.
export const refreshUserAccess = async (req, res) => {
    const userInfo = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        profilePic: req.user.profilePic
    };

    // Validate token and expiration in db.
    try {
        const currentUTC = new Date();

        const foundToken = await RefreshToken.findOne({
            userId: userInfo.id,
            token: req.refreshToken,
            expiresAt: { $gt: currentUTC }
        });

        if (!foundToken) {
            // The token either isn't registered or has expired.
            // If either is the case, the session is expired and the token/session
            // is no longer valid.
            return res.status(403).json({ message: "Unable to refresh user access" });
        }
    } catch (error) {
        console.error(`Error validating refresh token registration: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    const newAccessToken = generateAccessToken(userInfo);

    return res.status(200).json({ accessToken: newAccessToken });
}

// Delete the user from the database, ensuring all data and their resources
// are also removed.
export const deleteUser = async (req, res) => {
    try {
        await User.deleteOne({
            _id: req.user.id
        });

        await RefreshToken.deleteMany({
            userId: req.user.id
        });

        await Poll.deleteMany({
            createdBy: req.user.id
        });
    } catch (error) {
        console.error(`Could not delete user: ${error}`);
        return res.status(500).json({ message: "Internal Server Error" });
    }

    // Options object must be identical to when created
    // excluding expires and maxAge fields.
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "Strict"
    });

    return res.status(200).json({ message: "Deletion succeeded" });
}

// Set the user's profile picture. It is done via a link for
// this demo, so we need to validate it here.
export const setUserProfilePic = async (req, res) => {
    const { imageUrl } = req.body;

    if (!imageUrl) {
        return res.status(400).json({ message: "Image URL invalid." });
    }

    try {
        const response = await axios.head(imageUrl);

        const contentType = response.headers['content-type'];
        if (!contentType || !contentType.startsWith('image/')) {
            return res.status(400).json({ message: "URL does not link to a valid image" });
        }

        // Check if the image size is within 1 MiB limit
        const contentLength = parseInt(response.headers['content-length'], 10);
        if (contentLength > 1048576) { // 1 MiB in bytes
            return res.status(400).json({ message: "Image size exceeds 1 MiB" });
        }

        // If all checks pass, update user's profile with the image URL
        await User.updateOne({ _id: req.user.id }, { $set: { profilePic: imageUrl }});

        return res.status(200).json({ message: "Profile picture updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error validating image URL" });
    }
}