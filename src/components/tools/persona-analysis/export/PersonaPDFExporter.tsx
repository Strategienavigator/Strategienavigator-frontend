import {PDFExporter} from "../../../../general-components/Export/PDF/PDFExporter";
import {PersonaAnalysisValues} from "../PersonaAnalysis";
import {SaveResource} from "../../../../general-components/Datastructures";
import {SingleMessageProps} from "../../../../general-components/Messages/Messages";
import jsPDF from "jspdf";
import {Buffer} from 'buffer';
import {ResourcesType} from "../../../../general-components/Tool/ToolSavePage/ToolSavePage";
import {getFamilyStatus} from "../steps/PersonaInfo/PersonaInfoComponent";
import {PersonaPersonalityComponent} from "../steps/PersonaPersonality/PersonaPersonalityComponent";
import {PersonaSummaryItem} from "../steps/PersonaSummary/PersonaSummaryComponent";
import {info} from "autoprefixer";


class PersonaPDFExporter extends PDFExporter<PersonaAnalysisValues> {

    buildPDF = async (doc: jsPDF, save: SaveResource<PersonaAnalysisValues>, resources: ResourcesType): Promise<void> => {
        let infos = save.data["persona-info"]!;
        let personality = save.data["persona-personality"]!;

        this.setTitle(`Persona: ${infos!.firstname}`);

        let avatar = resources.get("avatar")!;
        let avatarSizes = await this.getImageSizes(avatar.file, 60, 80);

        doc.addImage({
            imageData: new Buffer(await avatar.file.arrayBuffer()).toString("base64"),
            width: avatarSizes.width,
            height: avatarSizes.height,
            format: "JPEG",
            x: this.getWidth(doc, 0),
            y: this.CalculateImageHeight(doc)
        });

        let padding = 4.5;

        // Main info
        let sizes = this.addNameValuePairs(doc, "Persona erstellt am:", [`${new Date(save.created_at).toLocaleString("de-DE")} Uhr`], avatarSizes.width + 7, this.height, padding);
        this.addNameValuePairs(doc, "Erstellt von:", [save.owner.username], this.getWidth(doc, sizes.width), undefined, 3);

        // Persona info
        this.addNameValuePairs(doc, "Vorname:", [infos.firstname!], avatarSizes.width + 7, undefined, padding)
        this.addNameValuePairs(doc, "Alter:", [`${infos.age} ${infos.age! === 1 ? "Jahr" : "Jahre"} alt`], avatarSizes.width + 7, undefined, padding);

        let income = new Intl.NumberFormat(
            "de-DE",
            {
                style: "currency",
                currency: "EUR"
            }
        ).format(infos.income ?? 0);

        this.addNameValuePairs(doc, "Einkommen:", [infos.income === null ? "Keins angegeben" : `Monatlicher Nettoverdienst von ${income}`], avatarSizes.width + 7, undefined, padding);
        this.addNameValuePairs(doc, "Familienstatus:", [getFamilyStatus(infos.familystatus)!], avatarSizes.width + 7);

        // Personalität
        let items: PersonaSummaryItem[] = [
            {
                name: "Familie & Freunde",
                fields: infos.family,
                icon: undefined
            },
            ...Object.values(personality.fields).map<PersonaSummaryItem>((data, index) => {
                return {
                    name: PersonaPersonalityComponent.names[index],
                    fields: data,
                    icon: PersonaPersonalityComponent.icons[index]
                };
            }),
            ...personality.individual
        ];


        this.height = 96;
        for (let i = 0; i < items.length; i += 2) {
            let item = items[i];

            // Leftitem
            sizes = this.addNameValuePairs(doc, item.name, item.fields.map(i => i.name), 0, this.height, padding);

            if (i + 1 < items.length) {
                item = items[i + 1]
                // Rightitem
                let sizesB = this.addNameValuePairs(doc, item.name, item.fields.map(i => i.name), this.getWidth(doc, sizes.width), this.height, padding);

                if (sizes.height > sizesB.height) {
                    this.height += sizes.height;
                } else {
                    this.height += sizesB.height;
                }
            }
        }
    }

    public validateExport(save: SaveResource<PersonaAnalysisValues>): SingleMessageProps[] {
        let errors: SingleMessageProps[] = [];
        if (save.data["persona-summary"] === undefined) {
            errors.push({
                content: "Bitte stellen Sie Ihr Persona erst fertig!",
                type: "DANGER"
            });
        }
        return errors;
    }

    private addNameValuePairs(doc: jsPDF, name: string, values: string[], width: number, useHeight?: number, heightPadding?: number) {
        if (values.length === 0) {
            values.push("Keine angaben");
        }

        let newWidth: number;
        let newHeight = 0;
        let height = 0;
        if (useHeight) {
            newHeight = doc.getTextDimensions(name, {fontSize: 13}).h
            height = useHeight + newHeight;
        } else {
            height = this.CalculateTextHeight(doc, name, 13);
        }

        // Name
        newWidth = this.getWidth(doc, width);
        doc.setFontSize(12);
        doc.setFont("Helvetica", "bold");
        doc.text(
            name,
            newWidth,
            height
        );
        doc.setFont("Helvetica", "normal");

        // Value
        let hightestWidth = doc.getTextDimensions(name, {fontSize: 12}).w;
        let lastLength = name.length;

        doc.setFontSize(11);
        values.forEach((v) => {
            if (useHeight) {
                let add = doc.getTextDimensions(v, {fontSize: 11}).h;
                height += add;
                newHeight += add
            } else {
                height = this.CalculateTextHeight(doc, v, 11);
            }

            if (v.length > lastLength) {
                hightestWidth = doc.getTextDimensions(v, {fontSize: 11}).w;
                lastLength = v.length;
            }

            doc.text(
                v,
                this.getWidth(doc, width),
                height
            );
        });
        newWidth += hightestWidth;

        if (!useHeight && heightPadding) {
            this.addHeightPadding(heightPadding);
            height += heightPadding;
        }
        if (heightPadding) {
            newHeight += heightPadding;
        }

        return {
            width: newWidth,
            height: newHeight
        };
    }
}

export {
    PersonaPDFExporter
}