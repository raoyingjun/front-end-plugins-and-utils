window.r = (function () {
    const COLORS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
    const COLORS_LENGTH = COLORS.length
    return {
        randomNum(min, max) {
            return min + Math.floor(Math.random() * (max - min + 1))
        },
        randomHexColor() {
            let hexColor = ''
            for (let i = 0; i < 6; i++) {
                hexColor += COLORS[this.randomNum(0, COLORS_LENGTH - 1)]
            }
            return '#' + hexColor
        }
    }
})()

