const router = require('express').Router();
const AuthorsController = require('./Controllers/authorController');
const SectorController = require('./Controllers/sectorController');
const SubsectorController = require('./Controllers/subsectorController');
const SubscribeController = require('./Controllers/subscribeController');
const ContactController = require('./Controllers/contactController');
const ReportController = require('./Controllers/reportController');
const ReportSubscribeController = require("./Controllers/reportSubscribeController")
const SearchLogsController = require("./Controllers/searchLogsController");
const ReportLogsController = require("./Controllers/reportLogsController");
const FilterController = require("./Controllers/filtersController");

 
// Reports API
router.post('/admin/add/report', ReportController.upload);
router.get("/reports", ReportController.getReports);
router.get("/years", ReportController.getYearCount);
router.get("/report/:rid", ReportController.getReportDetails);


// Authors API
router.post('/admin/add/author', AuthorsController.upload);

// Categories API
router.post('/admin/add/sector', SectorController.upload);
router.post('/sector/subsector', SubsectorController.getSubSectorsBySectorIds);

// Subcategories API
router.post('/admin/add/subsector', SubsectorController.upload);

// Subscribe API
router.post('/subscribe', SubscribeController.saveEmail);

// Report Subscribe API
router.post('/report-subscribe', ReportSubscribeController.saveEmail);
router.get('/check-email', ReportSubscribeController.checkEmailForGuestUser);

// Contact API
router.post('/contact', ContactController.saveContact);

// Save Search Query
router.post('/logs-search', SearchLogsController.saveSearchLogs);

// Save Reports Log
router.post('/logs-report', ReportLogsController.saveReportLogs);

// filters
router.get('/filters', FilterController.getAllFilters)
router.post('/author/filters', FilterController.getOtherFiltersFromAuthors)
router.post('/sector/filters', FilterController.getOtherFiltersFromSector)





module.exports = router;
