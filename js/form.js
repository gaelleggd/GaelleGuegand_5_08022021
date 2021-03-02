////////// Fonction de caractère attendu pour le nom, prénom et ville //////////
function isAlpha(value){
    return /[a-zA-Z]+/.test(value);
}

////////// Fonction de caractère attendu pour l'e-mail //////////
function validateEmail(value){
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)){
    return true;
  }
  return false;
}

////////// Fonction de caractère attendu pour l'adresse //////////
function isAdresse(value){
    return /\w+/.test(value);
}

////////// Fonction de validation du format des inputs - Messages d'erreur quand les champs ne sont pas remplis correctement //////////
function checkFormErrors(orderValidity){
    const error = document.getElementById("error");
    error.innerHTML = "";
    let inputIds = ["lastName", "firstName", "email", "adress", "city"];
    let inputTexts = ["nom", "prénom", "email", "adresse", "ville"];
    for (let i = 0; i < inputIds.length; i = i + 1){
        const input = document.getElementById(inputIds[i]);
        if (input.value === ""){
            const errorMessage = document.createElement("p"); // Création message d'erreur si input non renseigné
            errorMessage.setAttribute("class", "text-danger");
            errorMessage.innerHTML = "Merci d'indiquer votre " + inputTexts[i] + ".";
            orderValidity = false;
            error.appendChild(errorMessage);
        }else{
            if (inputIds[i] === "lastName" || inputIds[i] === "firstName" || inputIds[i] === "city"){
                if (isAlpha(input.value) === false){
                    const errorMessage = document.createElement("p"); // Création et affichage d'un message d'erreur si format de nom, prénom ou ville non conforme
                    errorMessage.setAttribute("class", "text-warning");
                    errorMessage.innerHTML = "Merci d'écrire votre " + inputTexts[i] + " en toutes lettres.";
                    orderValidity = false;
                    error.appendChild(errorMessage);
                }
            }
            if (inputIds[i] === "email"){
                if (validateEmail(input.value) === false){
                    const errorMessage = document.createElement("p"); // Création et affichage d'un message d'erreur si format d'email non conforme
                    errorMessage.setAttribute("class", "text-warning");
                    errorMessage.innerHTML = "Merci d'écrire un " + inputTexts[i] + " valide";
                    orderValidity = false;
                    error.appendChild(errorMessage);
                }
            }
            if (inputIds[i] === "adress"){
                if (isAdresse(input.value) === false){
                    const errorMessage = document.createElement("p"); // Création et affichage d'un message d'erreur si format de l'adresse non conforme
                    errorMessage.setAttribute("class", "text-warning");
                    errorMessage.innerHTML = "Merci d'écrire une " + inputTexts[i] + " valide";
                    orderValidity = false;
                    error.appendChild(errorMessage);
                }
            }
        }
    }
    return orderValidity;
}

////////// Fonction de renvoi des données par l'API //////////
function postCameras(url, jsonBody){
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
    
    for (let i = 0; i < basketContent.length; i =  i + 1){ // Placer dans le local storage chaque produit du panier
        idOrder.push(basketContent[i].id);
    }
    const command = new orderInfo(formInformation, idOrder);
    postCameras("http://localhost:3000/api/cameras/order", command).then( function(response){ // Utiliser la fonction post en tant que promise pour exécuter une autre fonction permettant de placer des infos dans le local storage
        localStorage.setItem("basketContent", JSON.stringify([])); 
        localStorage.setItem("orderConfirmation", response.orderId);        
        window.location.href = "confirmation.html"; // Redirection vers la page de confirmation
    }).catch(function(err){
        console.log(err);
        if(err === 0){ // requete ajax annulée
            alert("serveur HS");
        }
    });
}


const btn = document.getElementById("btn");
btn.addEventListener("click", function(event){ // Envoyer le formulaire de commande au click sur le bouton
    event.preventDefault();
    // let orderValidity = true;
    orderValidity = checkFormErrors(orderValidity);

    if (orderValidity === true){
        sendOrder();
    }
});
