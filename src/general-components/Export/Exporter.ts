import FileSaver from "file-saver";
import {SaveResource} from "../Datastructures";
import {Messages, SingleMessageProps} from "../Messages/Messages";


abstract class Exporter<D> {
    private readonly name: string;
    private readonly fileExtension: string;
    private readonly fileType: string;

    protected constructor(name: string, fileExtension: string, fileType: string) {
        this.name = name;
        this.fileExtension = fileExtension;
        this.fileType = fileType + ";charset=UTF-8";
    }

    /**
     * Anzeigename für den User
     * @protected
     */
    public getName() {
        return this.name;
    }

    public getFileExtension() {
        return this.fileExtension;
    }

    public getFileType() {
        return this.fileType;
    }

    public export = async (save: SaveResource<D>): Promise<void> => {
        let validate = this.validateExport(save);
        if (validate.length <= 0) {
            const blobPart = await this.onExport(save);
            const blob = new Blob(blobPart, {
                type: this.fileType
            });
            this.save(blob, save.name);
        } else {
            // Print error Messages
            validate.forEach((msg) => {
                Messages.addWithProps(msg);
            });
        }
    }

    protected abstract validateExport(data: SaveResource<D>): SingleMessageProps[];
    protected abstract onExport(data: SaveResource<D>): Promise<BlobPart[]>;

    /**
     * Öffnet Download Dialog und startet Download
     *
     * @param data Daten, die gespeichert werden soll
     * @param saveName Name des Speicherstands
     * @private
     */
    private save(data: Blob, saveName: string): void {
        let date = new Date();
        let fileName = saveName + " - " + date.toLocaleString() + "." + this.getFileExtension();
        FileSaver.saveAs(data, fileName);
    }
}

export {
    Exporter
}
