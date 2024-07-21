import bcrypt from "bcrypt";
import User from "../models/User.js";
import RefreshToken from "../models/RefreshToken.js";
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

    User.create(newUser)
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
            email: user.email
        };

        const accessToken = generateAccessToken(userInfo);
        let refreshToken;

        try {
            refreshToken = await generateRefreshToken(userInfo);
        } catch (error) {
            console.error(`Error generating refreshToken: ${error}`);
            return res.sendStatus(500);
        }

        return res.status(200).json({ accessToken, refreshToken });
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