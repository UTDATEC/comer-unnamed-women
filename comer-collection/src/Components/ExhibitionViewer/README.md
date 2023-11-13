# three-js-gallery
three js gallery js/css/html code for comer collection  
relies on three-js, three-js-stdlib and an appropriate json to create a gallery  

## user options
- flooring options(texture title in /images/)
  - needs a solution for multiple file types (make the value in json include the file type)
- matte color* (#XXXXXX)
- frame color* (#XXXXXX)
- frame size* (Decimal, inches)
- room darkness/brightness (enumeration: dark, moody dark, moody bright, bright)
- spotlight brightness* (Decimal)
- spotlight color* (#XXXXXX)
- main wall color (#XXXXXX)
- side wall color** (#XXXXXX)
- ceiling color (#XXXXXX)
- floor color (#XXXXXX)
- gallery length (Decimal, feet)
- gallery width (Decimal, feet)
- gallery height (Decimal, feet)
- ambient light color (#XXXXXX)
- left/right in relation to wall* (Decimal, feet)
- up/down in relation to eyelevel* (Decimal, feet)
- description* (String)
- direction[1,2,3,4]* (Enumeration: 1, 2, 3, 4 - starting with the wall forward, moving clockwise)  
*per photo  
**for the three other walls  

## NOTES ON CURATOR CUSTOMIZATION:
### frames:
- the frames are set to be a bit larger than originally intended. may remove when there is actual art from the collection, but it fits better like this for now (Frames.js lines 9 through 11)

### custom position:
- there are no safety bounds for this, and to be honest i dont feel like adding them because i feel like it should be 'on the student' whether or not they checked before turning in. This means you can set art outside the bounds of the gallery with no way of viewing it. Maybe create a suggestion somewhere to let someone know that the reason they cannot see a piece of art is because it has an invalid custom position

## Known Bugs:
- shift movement bug: holding shift while using wasd to move can cause event listeners to not recognize that a key has been unpressed. this also causes the camera to begin moving in a direction, as well as move beyond the bounding box and leave the gallery entirely without being able to move back in. 
  - current fix: reload page, do not press shift. 
- fix the event listener problem (click to view): in Render.js, we create event listeners for when a photo is clicked. The issue is that it creates [the amount of times your machine can complete the render function in the amount of time a single click is registered]. This can create upwards of like 2-300 event listeners, causing lag. Not necessesarily a bug, but definitely a performance loss that can be noticeable. 
  - current fix: none, program still works w/o it, purely performance difference