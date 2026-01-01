
export const myProfile = async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password ){
        res.status(400).json({ success: false, msg: "you must insert username and password"});
    }
    const mongoConn = req.mongoConn;
    const usersCollection = mongoConn.collection("users");
    const user = await usersCollection.findOne({username: username});
    if (!user){
        res.status(404).json({ success: false, data: req.body });
    
    } else {
      res.status(200).json({ success: true, data: {user: username, encryptedMessagesCount: user.encryptedMessagesCount }});
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, data: error.message });
  }
};
