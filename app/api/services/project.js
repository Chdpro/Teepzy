const projectModel = require('../models/project');

exports.CreateProject = async (Project) => {
    try {
        await projectModel.create(Project);
        let data = { status: 200, data: null, message: "Project created successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllProjects = async (userId) => {
    try {
        let projects = await projectModel.find({ userId: userId }).sort({ "createdAt": 1 });
        console.log("hey", projects)
        return projects;
    } catch (error) {
        console.log(error);
    }
}


exports.GetAllProjectsFromDash = async (userId) => {
    try {
        let projects = await projectModel.find({ userId: userId }).sort({ "createdAt": 1 });
        return projects;
    } catch (error) {
        console.log(error);
    }
}

exports.getProjectsOnSearchMatch = async (searchValue) => {
    try {
        let projects = await projectModel.find({ $text: { $search: searchValue } })
        return projects;
    } catch (error) {
        console.log(error);
    }
}

exports.DeleteProject = async (projectId) => {
    try {
        await projectModel.findByIdAndDelete(projectId);
    } catch (error) {
        console.log(error);
    }
}