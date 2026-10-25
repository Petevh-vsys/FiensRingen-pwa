RINGENBEHEER PWA — INSTALLATIE

1. Maak op GitHub een NIEUWE repository, bijvoorbeeld FiensRingen-PWA.
2. Upload de zes bestanden uit deze map naar de hoofdmap (root) van die repository.
3. Ga naar Settings > Pages > Build and deployment > Deploy from a branch.
   Selecteer main en /(root), klik Save.
4. Wacht tot GitHub Pages gepubliceerd is. Open de HTTPS-link die GitHub toont.
5. Open de link op je Motorola in Chrome en kies menu (drie puntjes) > App installeren
   of Toevoegen aan startscherm.
6. Open de geïnstalleerde app minstens één keer met internetverbinding.
   Daarna werkt ze ook zonder internet, zolang de browsergegevens behouden blijven.

LET OP:
- Open index.html niet rechtstreeks vanuit Downloads (file://): de PWA-serviceworker
  vereist HTTPS (of localhost). Publiceren op GitHub Pages is nodig.
- Ringgegevens en foto's worden uitsluitend lokaal in IndexedDB opgeslagen.
- Maak regelmatig een back-up via de knop 'Exporteer back-up'.
- De bestaande Android APK-database wordt NIET automatisch overgenomen.
- GitHub Pages voor een projectrepo kan openbaar toegankelijk zijn. De sitecode
  is publiek, maar je lokale ringgegevens worden niet naar GitHub verzonden.
