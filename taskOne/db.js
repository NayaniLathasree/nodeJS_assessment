const mongoose = require('mongoose'); 
const Policy = require('../models/policy');

const policiesAggregation = async (userId) => {
  try {
    return await Policy.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId)
        }
      },
      {
        $group: {
          _id: "$userId",
          totalPolicies: { $sum: 1 },
          policies: { $push: "$$ROOT" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      {
        $unwind: "$userDetails"
      },
      {
        $project: {
          _id: 0,
          userId: "$_id",
          totalPolicies: 1,
          userDetails: {
            firstName: "$userDetails.firstName",
            email: "$userDetails.email",
            phoneNumber: "$userDetails.phoneNumber",
            gender: "$userDetails.gender"
          },
          policies: 1
        }
      }
    ])
  } catch (error) {
    throw error;
  }
};


module.exports = {
    policiesAggregation
}