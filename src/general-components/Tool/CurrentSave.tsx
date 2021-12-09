import {SaveResource} from "../Datastructures";


class CurrentSave {

    public static INSTANCE: CurrentSave;
    public save: SaveResource<any> = {
        id: -1,
        name: "",
        description: "",
        data: {},
        locked_by: -1,
        last_locked: "",
        owner_id: -1,
        invited: [],
        contributors: [],
        tool_id: -1
    };

    public CurrentSave(save?: SaveResource<any>) {
        if (save) {
            this.save = save;
        }
        CurrentSave.INSTANCE = this;
    }

    public getSave() {
        return this.save;
    }

    public setSave(save: SaveResource<any>) {
        this.save = save;
    }

    public getID() {
        return this.save?.id;
    }

    public getName() {
        return this.save?.name;
    }

    public setName(name: string) {
        this.save.name = name;
    }

    public getDesc() {
        return this.save?.description;
    }

    public setDesc(desc: string) {
        this.save.description = desc;
    }

    public getData() {
        return this.save?.data;
    }

    public isset() {
        return this.save.id !== -1;
    }

}

export {
    CurrentSave
}