import React from "react";
import { Stack, Typography, Select, ListItemButton, Divider } from "@mui/material";
import { SchoolIcon, CheckIcon } from "../../IconImports";

export const CourseFilterMenu = ({ filterValue, setFilterValue, courses }) => {
    return (
        <Select displayEmpty value={filterValue?.id ?? ""}
            variant="outlined"
            sx={{
                wordWrap: "break-word", 
                width: "300px"
            }}
            renderValue={(selected) => {
                return (
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <SchoolIcon />
                        {courses.find((c) => c.id == selected) && (
                            <Typography variant="body1" sx={{ minWidth: "120px" }}>
                                {courses.find((c) => c.id == selected)?.safe_display_name}
                            </Typography>
                        ) ||
              <Typography variant="body1" sx={{ minWidth: "120px", opacity: 0.5 }}>
                Filter users by course
              </Typography>}
                    </Stack>
                );

            }}
            placeholder="All courses"
        >
            <ListItemButton key={""} value={""}
                onClick={(e) => {
                    setFilterValue(null);
                }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <CheckIcon sx={{ visibility: filterValue ? "hidden" : "" }} />
                    <Typography variant="body1" sx={{ minWidth: "120px" }}>
            Do not filter by course
                    </Typography>
                </Stack>
            </ListItemButton>
            <Divider sx={{padding: "4px"}} />
            {courses.sort((a, b) => (new Date(b.date_start)).getTime() - (new Date(a.date_start)).getTime()).map((course) => (
                <ListItemButton key={course.id} value={course.id}
                    onClick={(e) => {
                        setFilterValue(course);
                    }}>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <SchoolIcon sx={{ visibility: filterValue?.id == course.id ? "" : "hidden" }} />
                        <Stack direction="column" alignItems="left" spacing={0} sx={{}}>
                            <Typography variant="body1" sx={{ minWidth: "120px", maxWidth: "200px", wordWrap: "break-word" }}>
                                {course.name}
                            </Typography>
                            <Typography sx={{opacity: 0.5}}>
                                {(new Date(course.date_start)).toLocaleDateString()} - {(new Date(course.date_end)).toLocaleDateString()}
                            </Typography>
                        </Stack>
                    </Stack>
                </ListItemButton>
            ))}
        </Select>
    );
};
