
import mongoose from "mongoose";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { Message } from "./Message.model.js";
import { User } from "../CTHUser/User.model.js";
import { Chat } from "../Chats/Chat.model.js";


const sendMessage = asyncHandler(async (req, res) => {
      const { content, chatId } = req.body;

      if (!content || !chatId) {
            console.log("Bad Request! Invalid Data passed!");
            return res.sendStatus(400);
      }

      var newMessage = {
            sender: req.user._id,
            content: content,
            chat: chatId,
      };
      try {
            let message = await Message.create(newMessage);

            message = await message.populate("sender", "name avatar");

            message = await message.populate("chat");

            message = await User.populate(message, {
                  path: "chat.users",
                  select: "name avatar email",
            });

            await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

            res.json(message);
      } catch (error) {
            console.log(error);
            res.status(500);
            throw new Error(error.message);
      }
});

const allMessages = asyncHandler(async (req, res) => {
      try {
            const messages = await Message.find({ chat: req.params.chatId })
                  .populate("sender", "name avatar email")
                  .populate("chat");
            res.status(200).json(messages);
      } catch (error) {
            console.log(error);
            res.status(500);
            throw new Error(error.message);
      }
});

export { sendMessage, allMessages };
