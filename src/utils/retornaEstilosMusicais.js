module.exports.retornaEstilosMusicais = function (temperatura) {
    if (temperatura < 10) {
        return 'clássicas';
    } else if (temperatura >= 10 && temperatura <= 25) {
        return 'rock';
    } else {
        return 'pop';
    }
}