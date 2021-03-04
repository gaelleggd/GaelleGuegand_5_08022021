////////// Fonction de regex - définir les caractères attendus pour le nom, prénom et ville //////////
function textValid(value){
    return /[a-zA-Z]+/.test(value);
}

////////// Fonction de regex - définir les caractères attendus pour l'e-mail //////////
function emailValid(value){
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)){
    return true;
  }
  return false;
}

////////// Fonction de regex - définir les caractères attendus pour l'adresse //////////
function adressValid(value){
    const re = /^([0-9]{1,})[^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{3,}$/;
        return re.test(value);
}

////////// Fonction de validation du format des inputs - Messages d'erreur quand les champs ne sont pas remplis correctement //////////
function checkForm(orderValidity){
    const error = document.getElementById("error");
    error.innerHTML = "";
    let inputIds = ["lastName", "firstName", "email", "adress", "city"];
    let inputTexts = ["nom", "prénom", "email", "adresse", "ville"];
    for (let i = 0; i < inputIds.length; i = i + 1){
        const input = document.getElementById(inputIds[i]);
        if (input.value === ""){
            error.innerHTML += `<p class="text-danger">Merci d'indiquer votre ${inputTexts[i]}.</p>`
            orderValidity = false;
        }else{
            if (inputIds[i] === "lastName" || inputIds[i] === "firstName" || inputIds[i] === "city"){
                if (textValid(input.value) === false){
                    error.innerHTML += `<p class="text-warning">Merci d'écrire votre ${inputTexts[i]} en toutes lettres.`
                    orderValidity = false;
                }
            }
            if (inputIds[i] === "email"){
                if (emailValid(input.value) === false){
                    error.innerHTML += `<p class="text-warning">Merci d'écrire un ${inputTexts[i]} valide`
                    orderValidity = false;
                }
            }
            if (inputIds[i] === "adress"){
                if (adressValid(input.value) === false){
                    error.innerHTML += `<p class="text-warning">Merci d'écrire une ${inputTexts[i]} valide`
                    orderValidity = false;                }
            }
        }
    }
    return orderValidity;
}

////////// Fonction de renvoi des données à l'API //////////
function post(url, jsonBody){
    return new Promise(function(resolve, reject){
        const request = new XMLHttpRequest();
        request.open("POST", url);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = function (){
            if (this.readyState === 4){
                if(this.status === 201){
                    resolve(JSON.parse(this.responseText));
                    }else{
                    reject(request.status);
                }
            }
        };
        request.send(JSON.stringify(jsonBody));
    });
}

class infoForm { // information formulaire
    constructor(name, firstname, mail, adress, city) {
        this.lastName = name;
        this.firstName = firstname;
        this.email = mail;
        this.address = adress;
        this.city = city;
    }
}

class orderInfo { // information commande
    constructor(formInformation, idOrder) {
        this.contact = formInformation;
        this.products = idOrder;
    }
}

////////// Envoyer la requête de commande //////////
function sendOrder(){ 
    const name = document.getElementById("lastName").value;
    const firstname = document.getElementById("firstName").value;
    const mail = document.getElementById("email").value;
    const adress = document.getElementById("adress").value;
    const city = document.getElementById("city").value;  

    const formInformation = new infoForm (name, firstname, mail, adress, city);
    const basketContent = JSON.parse(localStorage.getItem("basketContent")); 

    let idOrder = [];
    
    for (let i = 0; i < basketContent.length; i =  i + 1){ // Placer dans l'idOrder chaque produit du panier
        idOrder.push(basketContent[i].id);
    }
    const command = new orderInfo(formInformation, idOrder);
    post("http://localhost:3000/api/cameras/order", command).then( function(response){ // Utiliser la fonction post en tant que promise pour placer des infos dans le local storage
        localStorage.setItem("basketContent", JSON.stringify([])); 
        localStorage.setItem("orderConfirmation", response.orderId);        
        window.location.href = "confirmation.html"; // Redirection vers la page de confirmation
    }).catch(function(err){ // récupérer les exceptions
        console.log(err);
        if(err === 0){ // requete ajax annulée
            alert("serveur HS");
        }
    });
}


const btn = document.getElementById("btn");
btn.addEventListener("click", function(event){ // Envoyer le formulaire de commande au click sur le bouton
    event.preventDefault();
    let orderValidity = true;
    orderValidity = checkForm(orderValidity);

    if (orderValidity === true){
        sendOrder();
    }
});
