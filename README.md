# toolbox-frontend  -  Guide
Das Projekt wurde mittels [Create React App](https://github.com/facebook/create-react-app) erstellt.

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
(Für Mitentwickelnde kann dies auch durch **git** oder **Github-Desktop** geschehen)<br />

Folgend muss sich NodeJS heruntergeladen werden. Dies kann [hier:link:](https://nodejs.org/de/) geschehen. Achten Sie hierbei auf die oben genannten Mindestvorraussetzungen.
Nach der Installation von NodeJS haben Sie die nötigen Programme und Programmierwerkzeuge um die Installation fortzusetzen.<br />

Nun muss die Kommandozeile gestartet werden und ins Hauptverzeichnis des Repositories manövriert werden.
Wenn Sie sich nicht bereits im Hauptverzeichnis des Repositories befinden, können Sie mithilfe des **cd**-Befehls zum Hauptverzeichnis gelangen.

```console
cd <pfad>
```

<br />Um die benötigten Bibliotheken und Pakete zu installieren wird der Node-Package-Manager (*npm*) benutzt. Der konkrete Befehl lautet hierzu:
```console
npm install
```
Dieser Schritt kann je nach System und Internetverbindung mehr Zeit in Anspruch nehmen.<br /><br />

Um nun das Projekt zu konfigurieren, muss die **.env** Datei erstellt und eingerichtet werden. Hierzu kopieren wir die mitgelieferte **.env.example** Datei.
```console
copy .env.example .env   // Windows
```
```console
cp .env.example .env     // Linux
```

Wenn die **.env** Datei vorhanden ist, muss diese bearbeitet werden. Öffnen Sie hierzu die Datei und stellen Sie die vorhandenden Umgebungsvariablen ein. Hierzu können Sie [folgende Dokumentation](./ENV.md) benutzen.

Nun ist die Installation abgeschlossen und der Entwicklungsserver kann gestartet werden. Hierzu ist folgender Befehl auszuführen:
```console
npm start
```

Startet den Entwicklungsserver.  
Der Server ist nun unter [http://localhost:3000:link:](http://localhost:3000) erreichbar.

Sämtliche Editierungen werden bei der Abspeicherung automatisch aktualisiert.
