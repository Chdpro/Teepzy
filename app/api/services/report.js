const reportModel = require('../models/report');

exports.CreateReport = async (Report) => {
    try {
        await reportModel.create(Report);
    } catch (error) {
        console.log(error);
    }
}

exports.changeReportStatus = async (ReportId, Report) => {
    try {
        await reportModel.findByIdAndUpdate(ReportId, Report);
    } catch (error) {
        console.log(error);
    }
}


exports.listReports = async () => {
    try {
        let reports = await reportModel.find({ type: "POST" });
        return reports;
    } catch (error) {
        console.log(error);
    }
}

exports.listSuggestions = async () => {
    try {
        let reports = await reportModel.find({ type: "SUGGESTION" });
        return reports;
    } catch (error) {
        console.log(error);
    }
}

exports.listBugs = async () => {
    try {
        let reports = await reportModel.find({ type: "BUG" });
        return reports;
    } catch (error) {
        console.log(error);
    }
}