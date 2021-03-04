////////// Fonction de récupération des articles de l'API pour les afficher sur la page d'accueil html //////////
function getCameras(url) { // Appel de l'API en fetch
    fetch(url)
    .then ((res) => res.json())
    .then ((data) => {
                 let place = '<div></div>';
        data.forEach(function(camera){ // Fonction pour créer les cartes pour chaque produit 
            place += `
                <div class="col-12 col-md-5 mx-auto">
                    <div class="card shadow mb-5">
                        <a href="produit.html?id=${camera._id}">
                        <img class="card-img-top" src="${camera.imageUrl}"></>
                        </a>
                        <div class ="card-body">
                        <h3 class="card-title">${camera.name}</h3>
                        <p class="card-text">${camera.description}</p>
                        <p class="card-text"> Optiques : ${camera.lenses}</p>
                        <p class="card-text">${camera.price/100} €</p>
                        </div>
                    </div>
                </div>
            `;
        });
    document.getElementById('emplacement').innerHTML = place; // Insertion des cartes en html sur la page
    })
}

////////// Appel de la fonction //////////
getCameras("http://localhost:3000/api/cameras");

