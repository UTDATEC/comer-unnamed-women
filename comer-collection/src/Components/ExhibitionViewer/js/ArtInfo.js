export function displayArtInfo(info) {
    const info_element = document.getElementById('art-info');
    if(info_element) {
        info_element.innerHTML = `
            <h3>${info.title}</h3>
            <p><i>${info.artist}</i>, <i>${info.medium}</i>, ${info.year}</p>
            <p><br></p>
            <p>${info.description}</p>
            <p><br></p>
            <p>${info.additional_information}</p>
            `;
    
        info_element.classList.add('show');

    }
};

export function hideArtInfo() {
    const info_element = document.getElementById('art-info');
    if(info_element) {
        info_element.classList.remove('show');
    }
};