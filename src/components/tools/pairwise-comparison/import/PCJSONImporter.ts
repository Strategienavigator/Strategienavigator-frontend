import {JSONImporter} from "../../../../general-components/Import/JSONImporter";


class PCJSONImporter extends JSONImporter {

    protected validate(data: object): Promise<void> {
        if(data) {

        }
        return Promise.resolve(undefined);
    }

}

export {
    PCJSONImporter
}