import Astrologer from "../models/astrologer.model.js";

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

    const astrologer = new Astrologer({
      username,
      language,
      expertise,
      experience,
      price,
      profilePic,
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
      const language = req.query.language.split("+");
      query.language = { $in: language };
    }

    if (req.query.expertise) {
      const expertise = req.query.expertise.split("+");
      query.expertise = { $in: expertise };
    }

    const astrologers = await Astrologer.find(query, { description: 0 })
      .sort(sortOption)
      .skip(skip)
      .limit(limit);

    if (!astrologers)
      return res
        .status(200)
        .json({ success: false, message: "No astrologers found" });
    const count = await Astrologer.find(query, {
      description: 0,
    }).countDocuments();
    return res.status(200).json({ success: true, astrologers, count });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getAstrologerDetails = async (req, res) => {
  try {
    const astrologerId = req.query.id;
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

    const astrologers = await Astrologer.find({username:search})

    if (!astrologers) {
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
    if (profilePic) astrologer.profilePic = profilePic;
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
