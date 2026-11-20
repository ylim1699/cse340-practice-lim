import { getFacultyBySlug, getSortedFaculty } from "../../models/faculty/faculty.js";

// Include proper error handling for invalid faculty IDs

const facultyListPage = async (req, res) => {
// function that renders the faculty list page
const sortBy = req.query.sort || 'name';
const facultyList = getSortedFaculty(sortBy);
    res.render('faculty/list', {
        title: 'Faculty Directory',
        faculty: facultyList,
        currentSort: sortBy
    });
};

const facultyDetailPage = async (req, res, next) => {
    const facultySlug = req.params.facultySlug;
    const member = getFacultyById(facultySlug);

    if (Object.key(member).length === 0) {
        const err = new Error(`Faculty member ${facultySlug} not found`);
        err.status = 404;
        return next(err);
    }

    res.render('faculty/detail', {
        title: member.name,
        member
    });
};

export { facultyListPage, facultyDetailPage};