import mongoose, { Schema } from "mongoose";
import { AvailableTaskStatues,TasksStatusEnum } from "../utils/constants";

const taskSchema = new Schema({
    title:{
        type:String,
        required: true,
        trim: true
    },
    description: String,
    project: {
        type:Schema.Types.ObjectId,
        ref:"Project",
        required: true
    },
    assignedTo: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    assignedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type:String,
        enum: AvailableTaskStatues.TODO
    },
    attachments: {
        type: [{
            url: String,
            mimeType:String,
            size: Number
        }],
        default:[]
    }
},{timestamps:true})

export const Tasks = mongoose.model("Task",taskSchema)