const validationErrorMessages = {
  uploadFile: "Please upload a valid file. Only .xlsx or .csv formats are accepted.",
  userName: "Please enter a valid username (1-255 characters).",
}

const strings = {
  processingFailed  : "Processing failed.",
  processingSuccess : 'File processed successfully.',
  processingExit :"Worker thread exited unexpectedly.",
  userNotFound : "User not found.",
  messageSchedule :"Message scheduled successfully.",
  policyNotFound : "'No policies found for user.",
  invalidUserId : "Invalid user ID format." 
}

module.exports = {
    validationErrorMessages,
    strings
}