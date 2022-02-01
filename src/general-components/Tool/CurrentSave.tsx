import {SaveResource} from "../Datastructures";


class CurrentSave<D> {

    public save?: SaveResource<D>;

    public CurrentSave(save?: SaveResource<D>) {
        if (save) {
            this.save = save;
        }
    }

    public getSave() {
        return this.save;
    }

    public setSave(save: SaveResource<D>) {
        this.save = save;
    }

    public getID() {
        return this.save?.id;
    }

    public getName() {
        return this.save?.name;
    }

    public setName(name: string) {
        if(this.save !== undefined)
            this.requireSave().name = name;
    }

    public getDesc() {
        return this.save?.description;
    }

    public setDesc(desc: string) {
        if(this.isset())
            this.requireSave().description = desc;
    }

    public getData() {
        return this.save?.data;
    }

    public isset() {
        return this.save !== undefined;
    }

    public requireSave(){
        if(this.save !== undefined)
            return this.save;
        else
            throw new Error("Save not set");
    }

}

export {
    CurrentSave
}
