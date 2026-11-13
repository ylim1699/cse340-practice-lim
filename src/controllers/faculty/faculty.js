import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

// Include proper error handling for invalid faculty IDs

const facultyListPage = (req, res) => {
// function that renders the faculty list page
const sortBy = req.query.sort || 'name';
const facultyList = getSortedFaculty(sortBy);
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyList,
        currentSort: sortBy
    });
};

const facultyDetailPage = (req, res, next) => {
    const facultyId = req.params.facultyId;
    const member = getFacultyById(facultyId);

    if (!member) {
        const err = new Error(`Faculty member ${facultyId} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: member.name,
        member
    });
};

export { facultyListPage, facultyDetailPage};