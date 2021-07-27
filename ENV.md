## Erklärung zum Befüllen der .env-Datei.

Die aktuelle **.env** Datei ist [hier](./.env.example) zu finden.  

Diese Datei dient allgemein betrachtet zum vordefinieren **globaler Variablen**, welche dann im gesamten Code frei genutzt werden können. Sämtliche Änderungen die Sie an der lokalen **.env-Datei** vornehmen haben keine Auswirkungen auf andere Mitentwickelnde oder das Gesamtprojekt. Daher müssen Sie sich im Bezug auf vorgenommene Änderungen keine Sorgen machen. :wink:

#### REACT_APP_NAME
Steht für den Namen des Projektes und wird zur Darstellung verwendet. Folglich ist diese globale Variable bereits mit dem Wert *Strategietools* vordefiniert. Dieser Wert kann aber beliebig angepasst werden. 

#### REACT_APP_API
Diese Variable wird für jegliche API-Calls von dem Frontend ausgehend zum Backend verwendet.
Der eingegebene Link in dem Browser muss zu dem Backend führen. Für XAMPP-Benutzer lautet dieser Link beispielsweise *http://localhost:80/toolbox-backend/public/api/*.   
   

Nachdem Sie die zuvor genannten Schritte ausgeführt haben, kehren Sie wieder in das ursprüngliche [Guide](https://github.com/ricom/toolbox-frontend/blob/main/README.md) zurück.
