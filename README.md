# Strategietools-Frontend
Das Projekt Strategietools basiert auf einer Idee aus der Software CRM-Navigator aus dem Jahre 2007. Die Strategietools sollen jedem einen einfachen Zugang zu strategischen Werkzeugen bieten. Insbesondere ist der Einsatz in der Hochschule geplant. Aber auch allen Interessierten stehen die Werkzeuge zur Verfügung.

Das Projekt wird an der Jade Hochschule in Wilhelmshaven am [Fachbereich Management Information Technologie:link:](https://www.jade-hs.de/mit/) entwickelt.

Das Frontend wurde mittels [Create React App](https://github.com/facebook/create-react-app) erstellt.  
Das Toolbox-Backend ist [hier:link:](https://github.com/ricom/toolbox-backend) zu finden.

## Weitere Informationen
[Interne Projektinformationen:link:](https://moodle.jade-hs.de/moodle/course/view.php?id=521&section=4)

## Vorraussetzungen
Programm/Package | min. Version
------------ | -------------
NodeJS | >= 16.2.0
npm  | >= 7.19.1

#### Mögliche IDE's
- WebStorm
- Visual Studio
- Visual Studio Code


## Installationsanweisungen

Zu Beginn muss sich das Github-Repository heruntergeladen und in einen von Ihnen gewählten Ordner platziert werden.  
(Für Mitentwickelnde kann dies auch durch **Git** oder **Github-Desktop** geschehen)<br />

Folgend muss sich NodeJS heruntergeladen werden. Dies kann [hier:link:](https://nodejs.org/de/) geschehen. Achten Sie hierbei auf die oben genannten Mindestvoraussetzungen.
Nach der Installation von NodeJS haben Sie die nötigen Programme und Programmierwerkzeuge um die Installation fortzusetzen.<br />

Nun muss die Kommandozeile gestartet werden und ins Hauptverzeichnis des Repositories manövriert werden.
Wenn Sie sich nicht bereits im Hauptverzeichnis des Repositories befinden, können Sie mithilfe des **cd**-Befehls zum Hauptverzeichnis gelangen.

```shell
cd <pfad>
```

<br />Um die benötigten Bibliotheken und Pakete zu installieren, wird der Node-Package-Manager (*npm*) benutzt. Der konkrete Befehl lautet hierzu:
```shell
npm install
```
Dieser Schritt kann je nach System und Internetverbindung mehr Zeit in Anspruch nehmen.<br /><br />

Um nun das Projekt zu konfigurieren, muss die **.env** Datei erstellt und eingerichtet werden. Hierzu kopieren wir die mitgelieferte **.env.example** Datei.
```shell
copy .env.example .env   // Windows
```
```shell
cp .env.example .env     // Linux
```

Wenn die **.env** Datei jetzt vorhanden ist, muss diese bearbeitet werden. Öffnen Sie hierzu die Datei und stellen Sie die vorhandenen Umgebungsvariablen ein. Hierzu können Sie [folgende Dokumentation](./ENV.md) benutzen.<br /><br />

Nun ist die Installation abgeschlossen und der Entwicklungsserver kann gestartet werden. Hierzu ist folgender Befehl auszuführen:
```shell
npm start
```

Startet den Entwicklungsserver.  
Der Server ist nun unter [http://localhost:3000:link:](http://localhost:3000) erreichbar.

Sämtliche Editierungen werden beim Abspeichern automatisch aktualisiert.


## Guidelines für Beteiligte
- Alles was keine Dokumentation oder Kommentare sind, muss in der englischen Sprache angefertigt werden.
- Alle Dokumentationen sollten in der deutschen Sprache angefertigt werden.
- Variablen- und Methodenbezeichnungen werden in Camelcase geschrieben.
- Wenn möglich sollen Dependency-Injection für Services verwendet werden.

## Bugs
Wenn ein Fehler gefunden wird, diesen bitte als [Issue](https://github.com/ricom/toolbox-frontend/issues) im Github Repository eintragen.

## Lizenz
[GNU GPL 3.0:link:](https://www.gnu.org/licenses/gpl-3.0.de.html) 

## Autoren
- [Nichlas Schipper:link:](https://github.com/nic-schi)  
- [Marcel Bankert:link:](https://github.com/Marce200700)  
- [Marco Janssen:link:](https://github.com/ma1160)  

Weiterhin kann auf die Liste der Projektteilnehmer in Github verwiesen werden.
