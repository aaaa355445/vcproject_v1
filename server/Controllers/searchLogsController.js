const searchLogSchema = require("../Models/searchLogModel");

class SearchLogsController {
  async saveSearchLogs(req, res) {
    const { guestId, searchQuery } = req.body;

    if (!guestId || !searchQuery) {
      return res.status(400).send("Guest ID and search query are required");
    }

    try {
      // Check if a document with the given guestId exists
      let searchLog = await searchLogSchema.findOne({ guestId });

      if (searchLog) {
        // If document exists, update it by appending the search query to the searchQuery array
        searchLog.searchQuery.push(searchQuery);
        await searchLog.save();
      } else {
        // If document does not exist, create a new one
        const newSearch = new searchLogSchema({ guestId, searchQuery: [searchQuery] });
        await newSearch.save();
      }

      res.status(201).send("Search query saved successfully");
    } catch (error) {
      console.error("Error saving search query:", error);
      res.status(500).send("Error saving search query");
    }
  }
}

module.exports = new SearchLogsController();
