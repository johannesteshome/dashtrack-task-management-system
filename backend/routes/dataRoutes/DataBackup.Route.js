const express = require("express");
const router = express.Router();
const {
    exportData,
    exportDataCloud
} = require("../../controller/dataController/dataBackupController");

router.get("/export-data", exportData);
router.get("/export-data-cloud", exportDataCloud);


module.exports = router;
