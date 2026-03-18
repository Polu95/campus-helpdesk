import Complaint from "./complaint.model.js";
import { cloudinary } from "../../config/cloudinary.js";


// ✅ Create Complaint (UNCHANGED)
export const createComplaint = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const complaint = await Complaint.create({
      title,
      description,
      category,
      imageUrl: result.secure_url,
      createdBy: req.user._id,
    });

    res.status(201).json(complaint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// ✅ USER: Get My Complaints (UNCHANGED + SAFE)
export const getMyComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const status = req.query.status || "All";

    const skip = (page - 1) * limit;

    let query = { createdBy: req.user._id };

    // ✅ FILTER IN BACKEND
    if (status !== "All") {
      query.status = status;
    }

    const complaints = await Complaint.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Complaint.countDocuments(query);

    // ✅ counts (optional but good)
    const pendingCount = await Complaint.countDocuments({
      createdBy: req.user._id,
      status: "Pending",
    });

    const inProgressCount = await Complaint.countDocuments({
      createdBy: req.user._id,
      status: "In Progress",
    });

    const resolvedCount = await Complaint.countDocuments({
      createdBy: req.user._id,
      status: "Resolved",
    });

    res.json({
      complaints,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      counts: {
        pending: pendingCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
      },
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ ADMIN: Get All Complaints (UPDATED WITH COUNTS)
export const getAllComplaints = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const status = req.query.status || "All";

    const skip = (page - 1) * limit;

    let query = {};

    if (status !== "All") {
      query.status = status;
    }

    // ✅ Paginated data
    const complaints = await Complaint.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // ✅ Total count (based on filter)
    const total = await Complaint.countDocuments(query);

    // ✅ GLOBAL COUNTS (FIX YOUR ISSUE)
    const pendingCount = await Complaint.countDocuments({ status: "Pending" });
    const inProgressCount = await Complaint.countDocuments({ status: "In Progress" });
    const resolvedCount = await Complaint.countDocuments({ status: "Resolved" });

    res.json({
      complaints,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,

      // ✅ NEW FIELD (VERY IMPORTANT)
      counts: {
        pending: pendingCount,
        inProgress: inProgressCount,
        resolved: resolvedCount
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


// ✅ Update Complaint (UNCHANGED)
export const updateComplaint = async (req, res) => {
  try {
    const { status, adminComment } = req.body;

    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    if (status) complaint.status = status;
    if (adminComment) complaint.adminComment = adminComment;

    await complaint.save();

    res.json(complaint);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};