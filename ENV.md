## Erklärung zum Befüllen der .env-Datei.

Die env variablen sind auf mehrere Dateien aufgeteilt. Die **.env .env.production** und **.env.development** sind.

Dort sollten also keine lokal spezifischen werte eingetragen werden wie **REACT_APP_API, REACT_APP_CLIENT_ID** oder **REACT_APP_CLIENT_SECRET**.

Die Werte müssen in **.env.development.local** eingetragen werden. Vorlagen für die **.env\*.local** sind vorhanden.

Diese Datei dient allgemein betrachtet zum Vordefinieren **globaler Variablen**, welche dann im gesamten Code frei
genutzt werden können. Falls Sie Änderungen an einer Ihrer **.env-Datei** vornehmen, werden diese erst bei Neustart des
Servers realisiert. Sämtliche Änderungen die Sie an der lokalen **.env-Datei** vornehmen haben keine Auswirkungen auf
andere Mitentwickelnde oder das Gesamtprojekt. Daher müssen Sie sich im Bezug auf vorgenommene Änderungen keine Sorgen
machen. :wink:

#### REACT_APP_NAME

Steht für den Namen des Projektes und wird zur Darstellung verwendet. Folglich ist diese globale Variable bereits mit
dem Wert *Strategienavigator* vordefiniert. Dieser Wert kann aber beliebig angepasst werden.

#### REACT_APP_API

Diese Variable wird für jegliche API-Calls von dem Frontend ausgehend zum Backend verwendet. Sie müssen diese globale
Variable mit dem Link initialisieren, der zu dem Backend führt. Letztendlich ist dies **für jeden Benutzer variabel**
und von einigen Faktoren wie zum Beispiel die Verzeichnisstruktur des jeweiligen Benutzers abhängig. Für XAMPP-Benutzer
könnte dieser Link beispielsweise *http://localhost:80/Strategienavigator-backend/public/* lauten. Dieser Wert sollte **nur bei dem
lokalen Verschieben des Backends** (*ändern der Verzeichnisstruktur*) angepasst werden. Falls sich die URL zu dem
Backend verändert, **muss** dieser Wert aktualisiert werden.

#### REACT_APP_CLIENT_ID und REACT_APP_CLIENT_SECRET

Zur Authentifizierung am Backend, wird ein von *[Passport:link:](https://laravel.com/docs/8.x/passport)*
bereitgestellter Client benötigt. Grundsätzlich sind für die globalen Variablen *REACT_APP_CLIENT_ID* und *
REACT_APP_CLIENT_SECRET* keine Werte vordefiniert, da auch diese **für jeden Benutzer unterschiedlich** sind. Wenn Sie
das [Backend-Guide:link:](https://github.com/ricom/Strategienavigator-backend/blob/main/README.md) bereits abgeschlossen haben,
dann haben Sie unter dem Punkt [Passport](https://github.com/ricom/Strategienavigator-backend#passport) den benötigten Client
bereits erstellt und können diesen dort auslesen. Sofern Sie aus beliebigen Gründen keinen Zugriff mehr auf das Fenster
zur Einsicht des Clients haben, können Sie den Befehl...

```bat
php artisan passport:install
```  

nochmals ausführen.

Die unter dem Punkt **Password grant client** genannte **Client ID** und **Client Secret** muss dann verwendet werden.
Die globale Variable **REACT_APP_CLIENT_ID** wird dann mit dem Wert für **Client ID** initialisiert. Der Wert in **
Client Secret** wird für das Initialisieren der globalen Variable **REACT_APP_CLIENT_SECRET** verwendet.

![Passport](https://github.com/ricom/Strategienavigator-frontend/blob/main/screenshots/passport_install.png)  
*Passport Install Beispielausgabe.* **Dargestellte Werte NICHT in eigene .env-Datei übernehmen !**

<br/>Nachdem Sie die zuvor genannten Schritte ausgeführt haben, kehren Sie wieder in das
ursprüngliche [Guide](./README.md) zurück.  
