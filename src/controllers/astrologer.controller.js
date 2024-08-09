import Astrologer from "../models/astrologer.model.js";
import uploadImage from "../utils/uploadImage.js";

export const addAstrologer = async (req, res) => {
  try {
    const {
      username,
      language,
      expertise,
      experience,
      price,
      profilePic,
      description,
    } = req.body;
    if (
      !username ||
      !language ||
      !expertise ||
      !experience ||
      !price ||
      !profilePic ||
      !description
    ) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    // if already exists
    const astrologerExists = await Astrologer.findOne({ username });
    if (astrologerExists) {
      return res
        .status(400)
        .json({ success: false, message: "Astrologer already exists" });
    }

    const profilePic_url = await uploadImage(profilePic);
    if (!profilePic_url)
      return res
        .status(500)
        .json({ success: false, message: "Failed to upload image" });

    const astrologer = new Astrologer({
      username,
      language,
      expertise,
      experience,
      price,
      profilePic: profilePic_url.secure_url,
      description,
    });
    await astrologer.save();
    return res.status(200).json({ success: true, message: "Astrologer added" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAstrologers = async (req, res) => {
  try {
    const limit = Math.max(1, parseInt(req.query.limit) || 5);
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const sortOption = {};

    if (req.query.priceSort) {
      sortOption.price = parseInt(req.query.priceSort);
    }

    if (req.query.experienceSort) {
      sortOption.experience = parseInt(req.query.experienceSort);
    }

    const skip = limit * (page - 1);
    const query = {};

    if (req.query.language) {
      const languages = req.query.language.split("+").map((lang) => {
        return lang.charAt(0).toUpperCase() + lang.slice(1).toLowerCase();
      });
      query.language = { $in: languages };
      console.log("aba ", languages);
    }

    if (req.query.expertise) {
      const expertises = req.query.expertise.split("+").map((expert) => {
        return expert.charAt(0).toUpperCase() + expert.slice(1).toLowerCase();
      });
      query.expertise = { $in: expertises };
    }

    const astrologers = await Astrologer.find(query, { description: 0 })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    if (!astrologers || astrologers.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No astrologers found" });
    }

    const count = await Astrologer.countDocuments(query);

    return res.status(200).json({ success: true, astrologers, count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAstrologerDetails = async (req, res) => {
  try {
    const astrologerId = req.params.id;
    const astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer)
      return res
        .status(200)
        .json({ success: false, message: "Astrologer not found" });
    return res.status(200).json({ success: true, astrologer });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const searchAstrologers = async (req, res) => {
  try {
    const search = req.params.search;

    // Use a regular expression to allow case-insensitive and partial matching
    const astrologers = await Astrologer.find({
      username: { $regex: search, $options: "i" },
    });

    if (!astrologers || astrologers.length === 0) {
      return res
        .status(200)
        .json({ success: false, message: "No astrologers found" });
    }
    return res.status(200).json({ success: true, astrologers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAstrologer = async (req, res) => {
  try {
    const astrologerId = req.params.id;
    const {
      username,
      description,
      expertise,
      language,
      experience,
      price,
      profilePic,
    } = req.body;

    if (
      !username &&
      !description &&
      !expertise &&
      !language &&
      !experience &&
      !price &&
      !profilePic
    ) {
      return res.status(400).json({
        success: false,
        message: "You are not provide any updated field",
      });
    }
    const astrologer = await Astrologer.findById(astrologerId);
    if (!astrologer) {
      return res
        .status(200)
        .json({ success: false, message: "Astrologer not found" });
    }
    if (username) astrologer.username = username;
    if (description) astrologer.description = description;
    if (expertise) astrologer.expertise = expertise;
    if (language) astrologer.language = language;
    if (experience) astrologer.experience = experience;
    if (price) astrologer.price = price;
    if (profilePic) {
      const result = await uploadImage(profilePic);
      astrologer.profilePic = result.secure_url;
    }
    await astrologer.save();
    return res
      .status(200)
      .json({ success: true, message: "Astrologer updated successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteAstrologer = async (req, res) => {
  try {
    const astrologerId = req.params.id;
    const astrologer = await Astrologer.findByIdAndDelete(astrologerId);
    if (!astrologer) {
      return res
        .status(200)
        .json({ success: false, message: "Astrologer not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Astrologer deleted successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
