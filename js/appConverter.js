// Dados da aplicação
const appData = {
  moedas: {
    BRL: {
      id: "BRL",
      img: "img/brlflag.png",
      name: "Real Brasileiro",
      price: {
        USD: 0.1917,
        EUR: 0.1563,
      },
    },
    USD: {
      id: "USD",
      img: "img/usaflag.png",
      name: "Dólar Americano",
      price: {
        BRL: 5.2164,
        EUR: 0.8193,
      },
    },
    EUR: {
      id: "EUR",
      img: "img/euroflag.png",
      name: "Euro",
      price: {
        BRL: 6.397,
        USD: 1.2206,
      },
    },
  },
  taxasPrice: {
    IOF: 1.1,
    FX: 1,
  },
  selected: "enviar"
};


// Objeto de controle da aplicação
const app = {
  enviar: {
    moeda: "USD",
    valor: 1000,
  },
  receber: {
    moeda: "BRL",
    valor: 0,
  },
  taxas: {
    IOF: 0,
    FX: 0,
  },  
}



// Calcula taxas e faz conversão para a moeda de recebimento
function calculator() {
  app.taxas.IOF = (app.enviar.valor * appData.taxasPrice.IOF) / 100;
  app.taxas.FX = (app.enviar.valor * appData.taxasPrice.FX) / 100;
  app.receber.valor =
    (app.enviar.valor - app.taxas.IOF - app.taxas.FX) *
    appData.moedas[app.enviar.moeda].price[app.receber.moeda];
}

// Formata valores de acordo com a moeda no padrão de separação Brasileiro
function formatCurrency(valor, moeda) {
  const obj = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: moeda,
  });
  return obj.format(valor);
}

// Obtém elementos visuais do DOM

// Você envia
const $inputEnviar = document.getElementById("inputEnviar");
const $moedaEnviar = document.getElementById("moedaEnviar");
const $imgBandeiraEnviar = document.getElementById("imgBandeiraEnviar");
const $lblMoedaEnviar = document.getElementById("lblMoedaEnviar");

// Taxas
const $lblIOF = document.getElementById("lblIOF");
const $lblFX = document.getElementById("lblFX");
const $lblCambio = document.getElementById("lblCambio");

// Beneficiários Recebe
const $inputReceber = document.getElementById("inputReceber");
const $moedaReceber = document.getElementById("moedaReceber");
const $imgBandeiraReceber = document.getElementById("imgBandeiraReceber");
const $lblMoedaReceber = document.getElementById("lblMoedaReceber");

// Menu de moedas
const $menuMoedas = document.querySelector(".menu-moedas");
const $itensMenuMoedas = document.getElementById("itensMenuMoedas");

// Cria menu de moedas cadastradas
const arrayMoedas = Object.values(appData.moedas);
let htmlMenu = "";
for (moeda of arrayMoedas) {
  htmlMenu += `<li data-moeda="${moeda.id}"><img src="${moeda.img}"> ${moeda.id} - ${moeda.name}</li>`;
}
$itensMenuMoedas.innerHTML = htmlMenu;

// Calcula taxas, conversão e exibe tudo em tela
function exibeValores() {
  calculator();

  // enviar values
  $inputEnviar.value = app.enviar.valor;
  $lblMoedaEnviar.innerText = app.enviar.moeda;
  $imgBandeiraEnviar.src = appData.moedas[app.enviar.moeda].img;

  //taxas
  $lblIOF.innerText = `(-) IOF ( ${appData.taxasPrice.IOF}%) = ${formatCurrency(
    app.taxas.IOF,
    app.enviar.moeda
  )}`;
  $lblFX.innerText = `(-) Taxa Administrativa ( ${
    appData.taxasPrice.FX
  }%) = ${formatCurrency(app.taxas.FX, app.enviar.moeda)}`;
  $lblCambio.innerText = `${app.enviar.moeda} 1 = ${app.receber.moeda} ${
    appData.moedas[app.enviar.moeda].price[app.receber.moeda]
  }`;

  // receber values
  $inputReceber.value = formatCurrency(app.receber.valor, app.receber.moeda);
  $lblMoedaReceber.innerText = app.receber.moeda;
  $imgBandeiraReceber.src = appData.moedas[app.receber.moeda].img;
}

// Recalcula tudo a cada mudança do valor de envio
function digitaValor(e) {    
  app.enviar.valor = e.target.value
  exibeValores();  
}

// Abre e fecha menu de moedas ao clicar para escolher moeda
function moedaClick(e, call) {  
  if (!$menuMoedas.classList.contains("exibir")) {
    appData.selected = call;
    $menuMoedas.classList.add("exibir");
    $menuMoedas.style.top = e.clientY + "px";
    $menuMoedas.style.left = e.clientX + "px";
    return;
  }
  $menuMoedas.classList.remove("exibir");
}

// Muda moeda selecionada
function mudaMoedaClick(e) {
  const moeda = e.target.dataset.moeda;  
  const selected = appData.selected;    
  if (app[selected].moeda !== moeda) {
    const unSelect = (selected == "enviar") ? "receber" : "enviar";
    const moedaUnSelect = app[unSelect].moeda;
    if (moedaUnSelect == moeda) {
      app[unSelect].moeda = app[selected].moeda;
    }
    app[selected].moeda = moeda;
    exibeValores();    
  }  
  $menuMoedas.classList.remove("exibir");
}

// Link de eventos e funções
$inputEnviar.oninput = digitaValor;
$moedaEnviar.onclick = (e) => moedaClick(e, "enviar");
$moedaReceber.onclick = (e) => moedaClick(e, "receber");
$itensMenuMoedas.onclick = mudaMoedaClick;

// Inicia aplicação mostrando valores iniciais
exibeValores();
