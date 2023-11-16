# three-js-gallery
three js gallery js/css/html code for comer collection  
relies on three-js, three-js-stdlib and an appropriate json to create a gallery  

## user options
- flooring options(texture title in /images/)
- matte color* (#XXXXXX)
- matte weighted* (true/false: true moves art upward to give the matte additional weight below the photo)
- matte weighted value* (Decimal, inches: positive vals are up, negative vals are down)
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
- additional description* (String)
*per photo  
**for the three other walls  

## NOTES ON CURATOR CUSTOMIZATION:
### matte weighted value:
- there are no safety bounds on this. A photo can be placed outside of its frame using this, which is fine. The weighted value only changes the matte if matte weighted is set to true. 

### frames:
- the frames are set to be a bit larger than originally intended. may remove when there is actual art from the collection, but it fits better like this for now (Frames.js lines 9 through 11)

### custom position:
- there are no safety bounds for this, and to be honest i dont feel like adding them because i feel like it should be 'on the student' whether or not they checked before turning in. This means you can set art outside the bounds of the gallery with no way of viewing it. Maybe create a suggestion somewhere to let someone know that the reason they cannot see a piece of art is because it has an invalid custom position

### description/additional description:
- there is nothing that checks length of this string. you can make it as long as you want, which causes it to go off screen. This is probably fine since the text descriptions should never be too long. 

## Known Bugs:
- fix the event listener problem (click to view): in Render.js, we create event listeners for when a photo is clicked. The issue is that it creates [the amount of times your machine can complete the render function in the amount of time a single click is registered]. This can create upwards of like 2-300 event listeners, causing lag. Not necessesarily a bug, but definitely a performance loss that can be noticeable. 
  - current fix: none, program still works, purely performance issue