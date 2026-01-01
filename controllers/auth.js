import { ObjectId } from "mongodb";



export const registerUser = async (req, res) => {
    try {
        const { username, password } = req.body
        const mongoConn = req.mongoConn;
        const usersCollection = mongoConn.collection("users");

        const newUser = {
            username: username,
            password: password,
            encryptedMessagesCount: 0

        };

        const result = await usersCollection.insertOne(newUser);
        res.status(201).json({ msg: `the ${username} registered succesfully`, id: new ObjectId(result._id) });

    } catch (err) {
        console.error(err);

        if (err.code === 11000) {
            return res.status(409).json({
                msg: "error",
                data: null,
                message: "A user with this name already exists",
            });
        }
        else {
            res.status(500).json({ msg: "error: " + err.message, data: null });
        }
    }
};
