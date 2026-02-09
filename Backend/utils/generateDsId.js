const Counter = require("../models/counterModel");

const getNextStudentId = async () => {
  const counter = await Counter.findByIdAndUpdate(
    { _id: "studentId" },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  // Get last two digits of the current year
  const year = new Date().getFullYear().toString().slice(-2);

  // Pad sequence with leading zeros
  const padded = String(counter.seq).padStart(5, "0"); // 00001, 00002, etc.

  return `DS-${year}-${padded}`;
};

module.exports = getNextStudentId;
