////////// Fonction pour ajouter les produits depuis le local storage vers le panier sur la page HTML //////////
function addBasketProduct(container, productInfo, productBasket, basketContent, totalPrice){
    const productContainer = document.createElement("div");
    productContainer.setAttribute("class", "row justify-content-around align-items-center mb-5");
    productContainer.innerHTML = `
    <img width="10%" src="${productInfo.imageUrl}"</img>
    <p class="col-md-3">${productInfo.name}</p>
    <div class="col-md-3">${productBasket.lenses}</div>
    <div class="col-md-3">${productInfo.price/100} €</div>
    `
    const btn = document.createElement ("button"); // Création du bouton pour supprimer un article
    btn.innerHTML = "Supprimer";
    btn.setAttribute("class", "bg-light text-dark");
    btn.setAttribute("data-id", productInfo._id);


    ////////// Définir l'actualisation du prix total du panier //////////
    totalPrice = totalPrice + productInfo.price;  

    btn.addEventListener('click', function(e){ // Supprimer un élément du panier au click sur le bouton
        const id = e.target.getAttribute("data-id");
        for (let x = 0; x != basketContent.length; x = x + 1){
            if (basketContent[x].id === id){
                basketContent.splice(x, 1);
                break;
            }
        }
        localStorage.setItem("basketContent", JSON.stringify(basketContent)); // Sauvegarde du panier mis à jour
        window.location.href = "panier.html"; // Revenir sur la page 
    });

    productContainer.appendChild(btn); // Choix de l'emplacement dans le html
    container.appendChild(productContainer);

    return totalPrice;
}

////////// Fonction pour afficher l'état du panier vide sur la page HTML //////////
function emptyBasketMessage(container){
    const emptyBasket = document.createElement("div")
    emptyBasket.innerHTML = "Votre panier est vide";
    container.appendChild(emptyBasket);

    return container;
}

////////// Fonction pour récupérer l'API et le stocker en promise //////////
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

////////// Appel de la fonction pour récupérer l'API en promise et effectuer une autre fonction qui en dépend //////////
getCam("http://localhost:3000/api/cameras/").then(function(data){
    //ajouter un élément au panier
    const basketContent = JSON.parse(localStorage.getItem("basketContent"));//récuperation local storage
    const container = document.getElementById("product-basket");
    if (basketContent.length === 0){ // Afficher le message du panier vide
        emptyBasketMessage(container);
    } else { // Appeler la fonction pour ajouter les produits depuis le local storage vers le panier sur la page HTML sous conditions
        let totalPrice = 0;
        for (let productBasket of basketContent){
            for (let productInfo of data){
                if (productBasket.id === productInfo._id){
                    totalPrice = addBasketProduct(container, productInfo, productBasket, basketContent, totalPrice);
                    localStorage.setItem("totalPriceConfirmationPage", totalPrice);
                }
            }
        }
        // Ajout du prix total à jour sur la page HTML
        const totalPriceBasket = document.getElementById("total-price")
        totalPriceBasket.innerHTML = "Total: " + totalPrice/100 + " €";
    }
}).catch(function(err){
    console.log(err);
    if(err === 0){ // requête ajax annulée
        alert("serveur HS");
    }
});
