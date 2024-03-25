import React from "react";
import { SchoolIcon } from "../../IconImports.js";
import PropTypes from "prop-types";
import { SecondaryFilterMenu } from "./SecondaryFilterMenu.js";
import { Typography } from "@mui/material";

const courseSortFunction = (a, b) => {
    return (new Date(b.date_start)).getTime() - (new Date(a.date_start)).getTime();
};

const courseDisplayFunction = (c) => {
    return (
        <>
            <Typography variant="body1" sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}>
                {c.name}
            </Typography>
            <Typography sx={{opacity: 0.5}}>
                {/* {} */}
                {(new Date(c.date_start)).toLocaleDateString() + "-" + (new Date(c.date_end)).toLocaleDateString()}
            </Typography>

        </>
    );
};

export const CourseFilterMenu = ({ filterValue, setFilterValue, courses }) => {
    return (
        <SecondaryFilterMenu SecondaryIcon={SchoolIcon} displayFunction={courseDisplayFunction} 
            helpMessage="Filter users by course" 
            emptyMessage="No course filters available" 
            nullMessage="Do not filter by course"
            sortFunction={courseSortFunction}
            secondaries={courses}
            {...{filterValue, setFilterValue}}
        />
    );
};


CourseFilterMenu.propTypes = {
    filterValue: PropTypes.object,
    setFilterValue: PropTypes.func,
    courses: PropTypes.arrayOf(PropTypes.object)
};