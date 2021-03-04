////////// Fonction pour ajouter les produits depuis le local storage vers le panier sur la page panier //////////
function createBasket(container, productInfo, productBasket, basketContent, totalPrice){
    const productContainer = document.createElement("div");
    productContainer.setAttribute("class", "row justify-content-around align-items-center mb-5");
    productContainer.innerHTML = `
    <img class="shadow" width="10%" src="${productInfo.imageUrl}"</img>
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
        for (let x = 0; x != basketContent.length; x = x + 1){ // parcourt tout le panier, si un élément envoyé lors du click est trouvé il est supprimé
            if (basketContent[x].id === id){
                basketContent.splice(x, 1);
                break;
            }
        }
        localStorage.setItem("basketContent", JSON.stringify(basketContent)); // Sauvegarde du panier mis à jour
        window.location.href = "panier.html"; // Revenir sur la page avec nombre de produits actualisé
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
    const basketContent = JSON.parse(localStorage.getItem("basketContent")); //récuperation local storage
    const container = document.getElementById("product-basket");
    if (basketContent.length === 0){ // Afficher le message du panier vide
        emptyBasketMessage(container);
    } else { // Appeler la fonction pour ajouter les produits depuis le local storage vers le panier sur la page HTML et mettre à jour le prix total
        let totalPrice = 0; 
        for (let productBasket of basketContent){ // pour chaque produit déjà stocké dans le local storage
            for (let productInfo of data){ // pour chaque info du produit dans les données récupérées dans l'API
                if (productBasket.id === productInfo._id){ // si l'id du produit dans le local storage est égal à l'id du produit dans l'API
                    totalPrice = createBasket(container, productInfo, productBasket, basketContent, totalPrice); // on éxécute la fonction pour ajouter le(s) produit(s) sur la page html en implémentant le prix total
                    localStorage.setItem("totalPriceConfirmationPage", totalPrice); // on créé la paire key/value du prix total
                }
            }
        }
        // Ajffichage du prix total à jour sur la page HTML
        document.getElementById("total-price").innerHTML = "Total: " + totalPrice/100 + " €";
    }
}).catch(function(err){
    console.log(err);
    if(err === 0){ // requête ajax annulée
        alert("serveur HS");
    }
});
