export const blankExhibitionData = {
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


const width_ft_min = 10;
const height_ft_min = 10;
const length_ft_min = 10;


export const exhibitionEditReducer = (exhibitionData, action) => {
    switch (action.scope) {
        case "exhibition":
            
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
                case "set_ceiling_color":
                    return {
                        ...exhibitionData,
                        appearance: {
                            ...exhibitionData.appearance,
                            ceiling_color: action.newColor
                        }
                    };
                case "set_floor_texture":
                    return {
                        ...exhibitionData,
                        appearance: {
                            ...exhibitionData.appearance,
                            floor_texture: action.newTexture
                        }
                    };
                case "set_moodiness":
                    return {
                        ...exhibitionData,
                        appearance: {
                            ...exhibitionData.appearance,
                            moodiness: action.newMoodiness
                        }
                    };
                case "set_ambient_light_color":
                    return {
                        ...exhibitionData,
                        appearance: {
                            ...exhibitionData.appearance,
                            ambient_light_color: action.newColor
                        }
                    };
                case "set_length":
                    return {
                        ...exhibitionData,
                        size: {
                            ...exhibitionData.size,
                            length_ft: action.newValue >= length_ft_min ? action.newValue : length_ft_min
                        }
                    };
                case "set_width":
                    return {
                        ...exhibitionData,
                        size: {
                            ...exhibitionData.size,
                            width_ft: action.newValue >= width_ft_min ? action.newValue : width_ft_min
                        }
                    };
                case "set_height":
                    return {
                        ...exhibitionData,
                        size: {
                            ...exhibitionData.size,
                            height_ft: action.newValue >= height_ft_min ? action.newValue : height_ft_min
                        }
                    };
                default:
                    console.log("Unrecognized exhibition edit action: ", action.type, action);
                    return exhibitionData;
            }
            
    
        default:
            console.log("Unrecognized exhibition edit scope: ", action.scope, action);
            return exhibitionData;
    }
};
