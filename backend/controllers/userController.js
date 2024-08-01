import bcrypt from "bcrypt";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
import Poll from "../models/Poll.js";
import { generateAccessToken, generateRefreshToken } from "../util/token.js";

// Create/Register user from given data.
export const createUser = async (req, res) => {
    let {
        username,
        email,
        password
    } = req.body;

    if (!username || !email || !password) return res.sendStatus(400);

    // Of course, we must hash the password for security.
    let hashedPassword;

    try {
        const salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(password, salt);
    } catch (error) {
        console.error(`Error during hashing: ${error}`);
        return res.sendStatus(500);
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
                return res.sendStatus(201);
            })
            .catch((error) => {
                console.error(`Error creating user: ${error}`);
                return res.sendStatus(500);
            });
}

// Log in user and return their data along with their tokens.
export const loginUser = async (req, res) => {
    const {
        usernameOrEmail,
        password
    } = req.body;

    if (!usernameOrEmail || !password) return res.sendStatus(400);

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
        return res.sendStatus(500);
    }

    if (!user) {
        return res.sendStatus(401);
    }

    const match = await bcrypt.compare(password, user.password);

    if (match) {
        // User has been authenticated, now create token pair and return success status.
        const userInfo = {
            id: user._id,
            username: user.username,
            email: user.email,
            emailVerified: user.emailVerified,
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

    return res.sendStatus(401);
}

// Clear the login sessions (refresh tokens) for the user.
// This will affect all devices. I could make it more granular
// but this is enough for now considering the nature of JWT.
export const logoutUser = async (req, res) => {
    // Clear all refresh tokens belonging to the user from the db.
    // This is essentially clearing all their 'sessions'.
    try {
        await RefreshToken.deleteMany({
            userId: req.user.id
        });
    } catch (error) {
        console.error(`Error logging out user: ${error}`);
        return res.sendStatus(500);
    }

    return res.sendStatus(204);
}

// Get the logged in user's info and return it to them.
export const fetchUserInfo = async (req, res) => {
    return res.status(200).json(req.user);
}

// Using the refresh token from the request, refresh the given user's
// session by returning a new access token to them.
export const refreshUserAccess = async (req, res) => {
    const userInfo = {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email
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
            return res.sendStatus(403);
        }
    } catch (error) {
        console.error(`Error validating refresh token registration: ${error}`);
        return res.sendStatus(500);
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
        return res.sendStatus(500);
    }

    return res.sendStatus(204);
}