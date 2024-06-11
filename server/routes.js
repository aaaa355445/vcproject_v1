const router = require('express').Router();
const AuthorsController = require('./Controllers/authorController');
const SectorController = require('./Controllers/sectorController');
const SubsectorController = require('./Controllers/subsectorController');
const SubscribeController = require('./Controllers/subscribeController');
const ContactController = require('./Controllers/contactController');
const ReportController = require('./Controllers/reportController');
const ReportSubscribeController = require("./Controllers/reportSubscribeController")
 
// Reports API
router.post('/admin/add/report', ReportController.upload);
router.get("/reports", ReportController.getReports);
router.get("/years", ReportController.getYearCount);


// Authors API
router.get('/authors', AuthorsController.getAllAuthors);
router.post('/admin/add/author', AuthorsController.upload);

// Categories API
router.post('/admin/add/sector', SectorController.upload);
router.get("/sector", SectorController.getAllSectors);
router.post('/sector/subsector', SubsectorController.getSubSectorsBySectorIds);

// Subcategories API
router.post('/admin/add/subsector', SubsectorController.upload);
router.get("/subsector", SubsectorController.getAllSubSectors);

// Subscribe API
router.post('/subscribe', SubscribeController.saveEmail);

// Report Subscribe API
router.post('/report-subscribe', ReportSubscribeController.saveEmail);
router.get('/check-email', ReportSubscribeController.checkEmailForGuestUser);

// Contact API
router.post('/contact', ContactController.saveContact);



module.exports = router;
