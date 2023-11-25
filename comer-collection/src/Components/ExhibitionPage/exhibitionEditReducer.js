export const exhibitionEditReducer = (exhibitionData, action) => {
    switch (action.type) {
        case "set_main_wall_color":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    main_wall_color: action.newColor
                }
            };
        case "set_side_wall_color":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    side_wall_color: action.newColor
                }
            };
        case "set_floor_color":
            return {
                ...exhibitionData,
                appearance: {
                    ...exhibitionData.appearance,
                    floor_color: action.newColor
                }
            };
        default:
            console.log("Unrecognized exhibition edit action: ", action);
            return exhibitionData;
    }
};export const blankExhibitionData = {
    "main": {
        "exhibition_name": "Placeholder Exhibition Name",
        "curator": "Placeholder Curator Name",
        "date_created": "Placeholder Date Created"
    },
    "appearance": {
        "main_wall_color": "#ffffff",
        "side_wall_color": "#ffffff",
        "floor_color": "#ffffff",
        "ceiling_color": "#ffffff",
        "floor_texture": "parquet_wood.jpg",
        "moodiness": "moody dark",
        "ambient_light_color": "#ffffff"
    },
    "size": {
        "length_ft": 25,
        "width_ft": 25,
        "height_ft": 10
    },
};

