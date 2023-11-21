import {Exporter} from "./Exporter";
import {SaveResource} from "../Datastructures";
import jsPDF from "jspdf";
import {SingleMessageProps} from "../Messages/Messages";

class PDFExporter<D> extends Exporter<D> {
    private readonly element: string;
    private readonly validateFunction: (data: SaveResource<D>) => SingleMessageProps[];

    constructor(element: string, validate: (data: SaveResource<D>) => SingleMessageProps[]) {
        super("PDF", "pdf", "application/pdf");
        this.element = element;
        this.validateFunction = validate;
    }

    public buildPDF(doc: jsPDF): jsPDF | undefined {
        return undefined;
    }

    protected onExport = async (data: SaveResource<D>): Promise<BlobPart[]> => {
        let pdf = new jsPDF({
            unit: "px",
            compress: true
        });
        pdf.setLanguage("de-DE");

        let pdfNew = this.buildPDF(pdf);
        let output: Blob | string = "";

        if (!pdfNew) {
            // Hole HTML-Element
            let element = this.getHTMLElement();
            if (element != null) {
                // Baue PDF
                let worker = pdf.html(element, {
                    jsPDF: pdf,
                    filename: `${this.getName()}.${this.getFileExtension()}`,
                    callback: (doc) => {
                        output = doc.output("blob")
                    },
                    margin: [10, 10, 10, 10]
                });
                await worker.doCallback();
            }
        } else {

        }
        return [output];
    }

    protected validateExport(data: SaveResource<D>): SingleMessageProps[] {
        return this.validateFunction(data);
    }

    private getHTMLElement() {
        let element = document.querySelector<HTMLElement>(this.element);
        if (element == null) {
            console.error(`HTML Element "${this.element}" not found!`);
        }
        return element;
    }

}

export {
    PDFExporter
}