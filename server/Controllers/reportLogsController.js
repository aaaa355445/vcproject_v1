const reportLogSchema = require("../Models/reportLogModel");

class ReportLogsController {
  async saveReportLogs(req, res) {
    const { rid, title, email, guestId } = req.body;

    if (!rid || !title || !guestId) {
      return res.status(400).send("Report ID, title, and either email or guest ID are required");
    }

    try {
      const threeMonthsAgo = new Date();
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

      // Check if a document with the given rid exists
      let reportLog = await reportLogSchema.findOne({ rid });

      if (reportLog) {
        // Filter out logs older than three months
        reportLog.logs = reportLog.logs.filter(log => new Date(log.createdAt) >= threeMonthsAgo);
        // If document exists, update it by adding or updating the log entry
        const logEntry = reportLog.logs.find(log => log.guestId === guestId);
        if (logEntry) {
          // Update the existing log entry
          logEntry.count += 1;
          logEntry.updatedAt = new Date();
        } else {
          // Add a new log entry
          reportLog.logs.push({ email, guestId, count: 1 });
        }
        reportLog.totalCount += 1;
        await reportLog.save();
      } else {
        // If document does not exist, create a new one
        const newReportLog = new reportLogSchema({
          rid,
          title,
          totalCount: 1,
          logs: [{ email, guestId, count: 1 }]
        });
        await newReportLog.save();
      }

      res.status(201).send("Report log saved successfully");
    } catch (error) {
      console.error("Error saving report log:", error);
      res.status(500).send("Error saving report log");
    }
  }
}

module.exports = new ReportLogsController();
