import mongoose from "mongoose"; 

const notificationSchema = new mongoose.Schema(
    {
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        type: {
            type: String,
            enum: ['like', 'comment', 'follow', 'mention'],
            required: true
        },
        
        post: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
            required: false
        }, 

        comment: {
            type: mongoose.Schema.Types.ObjectId,
            required: false
        },

        message: {
            type: String,
            required: true
        },

        read: {
            type: Boolean,
            default: false
        }
    },
    { timestamps: true } 
);

// Create the Notification model
const Notification = mongoose.model("Notification", notificationSchema);

// Export the model
export default Notification;

