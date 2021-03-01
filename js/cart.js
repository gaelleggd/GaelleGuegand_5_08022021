//information formulaire
class infoForm {
    constructor(name, firstname, mail, adress, city) {
        this.lastName = name;
        this.firstName = firstname;
        this.email = mail;
        this.address = adress;
        this.city = city;
    }
}

//information commande
class orderInfo {
    constructor(formInformation, idOrder) {
        this.contact = formInformation;
        this.products = idOrder;
    }
}

////////// Ajoute les produit du panier dans la page HTML //////////
function addBasketProduct(container, productInfo, productBasket, basketContent, totalPrice){
    const productContainer = document.createElement("div");
    productContainer.setAttribute("class", "row justify-content-around align-items-center mb-5");
    productContainer.innerHTML = `
    <img width="10%" src="${productInfo.imageUrl}"</img>
    <p class="col-md-3">${productInfo.name}</p>
    <div class="col-md-3">${productBasket.lenses}</div>
    <div class="col-md-3">${productInfo.price/100} €</div>
    `
    const btn = document.createElement ("button");
    btn.innerHTML = "Supprimer";
    btn.setAttribute("class", "bg-light text-dark");
    btn.setAttribute("data-id", productInfo._id);

    totalPrice = totalPrice + productInfo.price;        
    ////////// Supprimer un élément du panier //////////
    btn.addEventListener('click', function(e){ 
        const id = e.target.getAttribute("data-id");

        for (let x = 0; x != basketContent.length; x = x + 1){
            if (basketContent[x].id === id){
                basketContent.splice(x, 1);
                break;
            }
        }
        localStorage.setItem("basketContent", JSON.stringify(basketContent)); // Sauvegarde du panier mis à jour
        window.location.href = "panier.html"; // on revient à la page d'acceuil 
    });

    productContainer.appendChild(btn);
    container.appendChild(productContainer);

    return totalPrice;
}

////////// Validation Nom, Prénom, Ville expression regulière formulaire //////////
function isAlpha(value){
    return /[a-zA-Z]+/.test(value);
}

////////// Validation mail expression regulière formulaire //////////
function validateEmail(value){
 if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)){
    return true;
  }
  return false;
}

////////// Validation adresse expression regulière formulaire //////////
function isAdresse(value){
    return /\w+/.test(value);
}

////////////////////////// Message erreur du formulaire quand les champs ne sont pas remplis ///////////////////
function checkFormErrors(orderValidity){
    const error = document.getElementById("error");
    error.innerHTML = "";
    let inputIds = ["lastName", "firstName", "email", "adress", "city"];
    let inputTexts = ["nom", "prénom", "email", "adresse", "ville"];
    for (let i = 0; i < inputIds.length; i = i + 1){
        const input = document.getElementById(inputIds[i]);
        if (input.value === ""){
            const errorMessage = document.createElement("p");
            errorMessage.setAttribute("class", "text-danger");
            errorMessage.innerHTML = "Merci d'indiquer votre " + inputTexts[i] + ".";
            orderValidity = false;
            error.appendChild(errorMessage);
        }else{
            if (inputIds[i] === "name" || inputIds[i] === "firstname" || inputIds[i] === "city"){
                if (isAlpha(input.value) === false){
                    const errorMessage = document.createElement("p");
                    errorMessage.setAttribute("class", "text-warning");
                    errorMessage.innerHTML = "Merci d'écrire votre " + inputTexts[i] + " en toutes lettres.";
                    orderValidity = false;
                    error.appendChild(errorMessage);
                }
            }
            if (inputIds[i] === "email"){
                if (validateEmail(input.value) === false){
                    const errorMessage = document.createElement("p");
                    errorMessage.setAttribute("class", "text-warning");
                    errorMessage.innerHTML = "Merci d'écrire un " + inputTexts[i] + " valide";
                    orderValidity = false;
                    error.appendChild(errorMessage);
                }
            }
            if (inputIds[i] === "adress"){
                if (isAdresse(input.value) === false){
                    const errorMessage = document.createElement("p");
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

////////// Envoyer la requête de commande //////////

function postCameras(url, jsonBody){
    // Je crée une fonction pour demander à l'API de RENVOYER les éléments contenus dans l'url du serveur local, dans un .json
        return new Promise(function(resolve, reject)
        {
            const request = new XMLHttpRequest();
            request.open("POST", url);
            request.setRequestHeader("Content-Type", "application/json");
            request.onreadystatechange = function () 
            {
                if (this.readyState === 4)
                {
                    if(this.status === 201)
                    {
                        resolve(JSON.parse(this.responseText));
                     }else{
                        reject(request.status);
                    }
                }
            };
            request.send(JSON.stringify(jsonBody));
        });
        
    }


function sendOrder(){
    const name = document.getElementById("lastName").value;
    const firstname = document.getElementById("firstName").value;
    const mail = document.getElementById("email").value;
    const adress = document.getElementById("adress").value;
    const city = document.getElementById("city").value;  

    const formInformation = new infoForm (name, firstname, mail, adress, city);
    const basketContent = JSON.parse(localStorage.getItem("basketContent"));

    let idOrder = [];
    
    for (let i = 0; i < basketContent.length; i =  i + 1){
        basketContent[i].id;
        idOrder.push(basketContent[i].id);
    }
    const command = new orderInfo(formInformation, idOrder);
    postCameras("http://localhost:3000/api/cameras/order", command).then( function(response){
        localStorage.setItem("basketContent", JSON.stringify([])); 
        localStorage.setItem("orderConfirmation", response.orderId);        
        window.location.href = "confirmation.html"; // on va à la page de confirmation
    }).catch(function(err){
        console.log(err);
        if(err === 0){ // requete ajax annulée
            alert("serveur HS");
        }
    });
}
////////// Message panier vide //////////
function emptyBasketMessage(container){
    const emptyBasket = document.createElement("div")
    emptyBasket.innerHTML = "Votre panier est vide";
    container.appendChild(emptyBasket);

    return container;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
getCam = async (url) => {
    try {
        let response = await fetch(url);
        if (response.ok){
            let dataList = await response.json();
            return dataList
        } else {
            console.log('Retour du serveur : ' + response.status);
        }
    } catch (e) {
        console.error(e);
    }
}


getCam("http://localhost:3000/api/cameras/").then(function(data){
    //ajouter un élément au panier
    const basketContent = JSON.parse(localStorage.getItem("basketContent"));//récuperation local storage
    const container = document.getElementById("product-basket");
    if (basketContent.length === 0){ //Message panier vide
        emptyBasketMessage(container);
    } else {
        let totalPrice = 0;
        for (let productBasket of basketContent){
            for (let productInfo of data){
                if (productBasket.id === productInfo._id){
                    totalPrice = addBasketProduct(container, productInfo, productBasket, basketContent, totalPrice);
                    localStorage.setItem("totalPriceConfirmationPage", totalPrice);
                }
            }
        }
        // calcul du total
        const totalPriceBasket = document.getElementById("total-price")
        totalPriceBasket.innerHTML = "Total: " + totalPrice/100 + " €";
    }
}).catch(function(err){
    console.log(err);
    if(err === 0){ // requete ajax annulée
        alert("serveur HS");
    }
});

// Message d'erreur formumlaire de validation
const btn = document.getElementById("btn");

btn.addEventListener("click", function(event){
    event.preventDefault();
    let orderValidity = true;
    orderValidity = checkFormErrors(orderValidity);

    if (orderValidity === true){
        sendOrder();
    }
});

