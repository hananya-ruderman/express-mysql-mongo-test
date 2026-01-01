import { atbash, shuffleWord} from "../utils/functions.js";

export const encryptMessage = async (req, res) => {
  try {
 
    const {username, password, message, cipherType} = req.body

    if (!username || !password || !message || !cipherType){
        res.status(400).json({ success: false, msg: "you must insert all fields"});
    }
    const mongoConn = req.mongoConn;
    const usersCollection = mongoConn.collection("users");

    const user = await usersCollection.findOne({username: username});
    if (!user){
        res.status(404).json({ success: false, data: req.body });
    }
    let encryptedMessage

    
    if (cipherType.toUpperCase()=== "ATBASH"){
        encryptedMessage = atbash(message)
    } else if (cipherType.toUpperCase() === "RANDOM_SHUFFLE"){
        encryptedMessage = shuffleWord(message)
    } else {
        
        encryptedMessage = message.split("").reverse().join("")
    }


    const [result] = await req.mysqlConn.query(
      "INSERT INTO messages (username, cipher_type, encrypted_text) VALUES (?, ?, ?)",
      [
        username,
        cipherType,
        encryptedMessage
      ]
    );
   
    const messageId = result.insertId
    await usersCollection.updateOne({username: username}, {$inc: {encryptedMessagesCount: 1}})
    res.status(201).json({ msg: "success", id: messageId, cipherType: cipherType, encryptedText: encryptedMessage});
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};


export const decryptMessage = async (req, res) => {
  try {
 
    const {username, password, messageid} = req.body

    if (!username || !password ){
        res.status(400).json({ success: false, msg: "you must insert username and password"});
    }
    const mongoConn = req.mongoConn;
    const usersCollection = mongoConn.collection("users");

    const user = await usersCollection.findOne({username: username});
    if (!user){
        res.status(404).json({ success: false, data: req.body });
    }
    const [result] = await req.mysqlConn.query("SELECT * FROM messages WHERE id = ?;", messageid)
    const encryptedMessage = result[0].encrypted_text
    let decryptedMessage;
    if (result[0].cipher_type.toUpperCase() == "REVERSE"){
        decryptedMessage = encryptedMessage.split("").reverse().join("")
    }
    else if (result[0].cipher_type.toUpperCase() === "ATBASH"){
        decryptedMessage = atbash(encryptedMessage)
    }
    else if (result[0].cipher_type.toUpperCase() === "RANDOM_SHUFFLE"){
        decryptedMessage  = encryptedMessage
    }
   
   
    const messageId = result[0].id
    res.status(201).json({ msg: "success", id: messageId, decryptedMessage: decryptedMessage});
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};


export const listMyMessages = async (req, res) => {
    try{
    const {username, password} = req.body

    if (!username || !password ){
        res.status(400).json({ success: false, msg: "you must insert username and password"});
    }
    const mongoConn = req.mongoConn;
    const usersCollection = mongoConn.collection("users");

    const user = await usersCollection.findOne({username: username});
    if (!user){
        res.status(404).json({ success: false, data: req.body });
    }
    const result = await req.mysqlConn.query("SELECT * FROM messages")
    const messagesArr = result[0];

    res.status(200).json({ msg: "success", data: messagesArr });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error" + err.message, data: null });
  }
};