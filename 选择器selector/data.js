function randomRange(min, max) {
    return min + Math.floor(Math.random() * (max - min + 1))
}

function getData() {
    const data = []
    for (let i = 0; i < randomRange(5, 10); i++) {
        data[i] = {
            text: 'text-' + i,
            value: 'value-' + i,
            children: []
        }
        for (let j = 0; j < randomRange(5, 10); j++) {
            data[i].children[j] = {
                text: 'text-' + i + '-' + j,
                value: 'value-' + i + '-'  + j,
                children: []
            }
            for (let k = 0; k < randomRange(5, 10); k++) {
                data[i].children[j].children[k] = {
                    text: 'text-' + i + '-'  + j + '-'  + k,
                    value: 'value-' + i + '-'  + j + '-'  + k
                }
            }
        }
    }
    return data
}