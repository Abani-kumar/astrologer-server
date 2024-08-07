import mongoose from "mongoose";

const astrologerSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      index: true,
    },
    language: {
      type: [String],
      required: true,
    },
    expertise: {
      type: [String],
      required: true,
    },
    experience: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    profilePic: {
      type: String,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Astrologer = mongoose.model("Astrologer", astrologerSchema);

export default Astrologer;
