const btnCalcular = document.getElementById('btnCalcular')
const btnNovaConta = document.getElementById('btnNovaConta')
const btnSimular = document.getElementById('btnSimular')
const outListaParcelas = document.getElementById('listaParcelas')
const outQtdParcelas = document.getElementById('qtdParcelas')

btnCalcular.addEventListener('click', calcular)
btnNovaConta.addEventListener('click', limparCampos)
btnSimular.addEventListener('click', simular)

// multa por atraso
const TAXA_MULTA = 2 / 100
// juros por dia de atraso
const TAXA_JUROS = 0.33 / 100

function formataMoeda(input) {

    var valor = input.value

    valor = valor + '';
    valor = parseInt(valor.replace(/[\D]+/g, ''));
    valor = valor + '';
    valor = valor.replace(/([0-9]{2})$/g, ",$1");

    if (valor.length > 6) {
        valor = valor.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    input.value = valor;
    if (valor == 'NaN') return input.value = '';

    return valor;
    // return valor.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function limparCampos() {
    location.reload();
}

function formatoRealBr(input) {

    return input.toFixed(2).replace('.', ',');

}

function formatoReal(numero) {
    var tmp = numero + '';
    var neg = false;

    if (tmp - (Math.round(numero)) == 0) {
        tmp = tmp + '00';
    }

    if (tmp.indexOf(".")) {
        tmp = tmp.replace(".", "");
    }

    if (tmp.indexOf("-") == 0) {
        neg = true;
        tmp = tmp.replace("-", "");
    }

    if (tmp.length == 1) tmp = "0" + tmp

    tmp = tmp.replace(/([0-9]{2})$/g, ",$1");

    if (tmp.length > 6)
        tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");

    if (tmp.length > 9)
        tmp = tmp.replace(/([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, ".$1.$2,$3");

    if (tmp.length = 12)
        tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, ".$1.$2.$3,$4");

    if (tmp.length > 12)
        tmp = tmp.replace(/([0-9]{3}).([0-9]{3}).([0-9]{3}).([0-9]{3}),([0-9]{2}$)/g, ".$1.$2.$3.$4,$5");

    if (tmp.indexOf(".") == 0) tmp = tmp.replace(".", "");
    if (tmp.indexOf(",") == 0) tmp = tmp.replace(",", "0,");

    return (neg ? '-' + tmp : tmp);
}

function calcular() {

    let dataVenc = document.getElementById('inputDataVencimento')
    let vValor = document.getElementById('inputValor')
    let vMulta = document.getElementById('inputMulta')
    let vJuros = document.getElementById('inputJuros')
    let vTotal = document.getElementById('inputTotal')

    let atraso = 0
    let multa = 0
    let juros = 0
    let diasAtraso = 0
    let total = 0

    let hoje = new Date();
    let vencimentoHoje = new Date()

    let vencimento = dataVenc.value
    let valorConta = vValor.value

    valorConta = valorConta.replace('.', '').replace(',', '.')
    valorConta = Number(valorConta)

    if (vencimento == '') {
        alert('Digite a de vencimento atual!')
        dataVenc.focus()
        return
    }

    if (valorConta == 0 || isNaN(valorConta)) {
        alert('Valor da conta zerado ou inválido!')
        vValor.focus()
        return
    }

    let fragmento = vencimento.split('-')

    vencimentoHoje.setDate(Number(fragmento[2]))
    vencimentoHoje.setMonth(Number(fragmento[1]) - 1)
    vencimentoHoje.setFullYear(Number(fragmento[0]))

    atraso = hoje - vencimentoHoje

    if (atraso > 0) {
        // converte os milissegundos da diferença em dias
        // (1 dia = 24hor x 60min x 60seg x 1000mseg: 86400000)
        // round(): necessário para períodos envolvendo horário de verão
        diasAtraso = Math.round(atraso / 86400000)

        multa = valorConta * TAXA_MULTA
        juros = (valorConta * TAXA_JUROS) * diasAtraso
    }

    total = valorConta + multa + juros

    // vMulta.value = multa.toFixed(2)
    // vJuros.value = juros.toFixed(2)
    // vTotal.value = total.toFixed(2)

    vMulta.value = formatoRealBr(multa)
    vJuros.value = formatoRealBr(juros)
    vTotal.value = formatoRealBr(total)
}

function simular() {

    let vQtdParcelas = document.getElementById('inputQtdParcelas')
    let vTotal = document.getElementById('inputTotal')

    let hoje = new Date();

    let parcelas = vQtdParcelas.value
    let total = vTotal.value
    let valorParcela = 0

    total = total.replace('.', '').replace(',', '.')
    total = Number(total)

    let lista = ''
    let dia, mes, ano, diaZero, mesZero, dataMontada

    if (total == 0 || isNaN(total)) {
        alert('O Valor total precisa ser preenchido!')
        vQtdParcelas.focus()
        return
    }

    if (parcelas == '' || parcelas == 0) {
        alert('É necessário a quantidade de parcelas para simulação.')
        vQtdParcelas.focus()
        return
    }

    valorParcela = total / parcelas

    for (let n = 1; n <= parcelas; n++) {

        hoje.setMonth(hoje.getMonth() + 1)
        dia = hoje.getDate()
        mes = hoje.getMonth() + 1
        ano = hoje.getFullYear()

        diaZero = dia < 10 ? '0' + dia : dia
        mesZero = mes < 10 ? '0' + mes : mes

        dataMontada = diaZero + '/' + mesZero + '/' + ano
        // lista += n + 'a Parcela: ' + dataMontada + ' no valor de R$ ' + formatoRealBr(valorParcela)

        lista += '<li class="list-group-item d-flex justify-content-between lh-condensed">'
        lista += '    <div>'
        lista += '        <h6 class="my-0">' + n + 'a Parcela: ' + dataMontada + ' no valor de R$ ' + formatoRealBr(valorParcela) + '</h6>'
        lista += '    </div>'
        lista += '</li>'
    }

    outQtdParcelas.textContent = parcelas
    outListaParcelas.innerHTML = lista

}