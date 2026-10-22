import { getFacultyById, getSortedFaculty, getFaculty } from "../../models/faculty/faculty.js";

// Include proper error handling for invalid faculty IDs

const facultyListPage = (req, res) => {
// function that renders the faculty list page
const facultyList = getFaculty();
    res.render('faculty/list', {
        title: 'Faculty List',
        faculty: facultyList
    });
};

const facultyDetailPage = (req, res) => {
// function that uses route parameters to look up individual faculty
};

export { facultyListPage, facultyDetailPage};