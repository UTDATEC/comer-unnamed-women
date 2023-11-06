import primary_json from '../example2.json' assert { type: "json" };


export function generateArtData() {

    const art_data = [];

    // copy all the data from json
    primary_json.images.forEach((image) => {

        const item = {

            img_src: image.image_id,

            position: {
                custom_x: image.position.custom_x,
                custom_y: image.position.custom_y,
                custom_position: image.position.custom_position
            },

            size: {
                width: image.size.width,
                height: image.size.height
            },

            matte: {
                color: image.matte.color
            },

            frame: {
                custom: image.frame.custom,
                width: image.frame.width, 
                height: image.frame.height,
                color: image.frame.color
            },

            light: {
                intensity: image.light.intensity,
                color: image.light.color
            },

            metadata: {
                title: image.metadata.title,
                artist: image.metadata.artist,
                description: image.metadata.description,
                year: image.metadata.year,
                medium: image.metadata.medium,
                additional_information: image.metadata.additional_information,
                direction: image.metadata.direction
            }
        };

        // add item to array of data
        art_data.push(item);
    });

    // return art data
    return art_data;
}