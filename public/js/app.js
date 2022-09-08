console.log('Desde la carpeta public');

document.addEventListener('click', (e) => {
   if (e.target.matches('[data-short]')) {
      const url = `${window.location.origin}/short/${e.target.dataset.short}`;

      navigator.clipboard
         .writeText(url)
         .then(() => console.log('Url copiada'))
         .catch((err) => console.log('Error: ' + err));
   }
});
