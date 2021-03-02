function addConfirmationText(){
    const confirmationId = localStorage.getItem("orderConfirmation"); // récuperation de l'ID de confirmation dans le local storage
    const totalPrice = localStorage.getItem("totalPriceConfirmationPage"); //récuperation du prix final dans le local storage
    
    // Ajout de la confirmation de commande dans le html
    document.getElementById("confirmation").innerHTML =`
    <p class="confirmation-title pt-5 text-center"> Nous vous remercions pour votre commande n° ${confirmationId}</p>
    <p class="confirmation-title text-center"> Prix total de votre commande: ${totalPrice/100} €</p>
    `
}
addConfirmationText(); // Appel de la fonction