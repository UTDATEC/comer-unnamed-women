export function displayArtInfo(info) {
    const info_element = document.getElementById('painting-info');
    info_element.innerHTML = `
        <h3>${info.title}</h3>
        <p>Artist: ${info.artist}</p>
        <p>Description: ${info.description}</p>
        <p>Year: ${info.year}</p>
        `;

    info_element.classList.add('show');
};

export function hideArtInfo() {
    const info_element = document.getElementById('painting-info');
    info_element.classList.remove('show');
};