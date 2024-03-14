import {mount} from "cypress/react18"
import '../../index.scss'
import {UserContextComponent} from "../Contexts/UserContextComponent";
import {Session} from "../Session/Session";
import {User} from "../User";
import {SharedSavePermission, SimpleSaveResource} from "../Datastructures";
import {LastOpenedSaves} from "./LastOpenedSaves";
import {MemoryRouter} from "react-router";

const testSave = {
    id: 1,
    name: "SaveName",
    description: "SaveBeschreibung",
    created_at: new Date().toDateString(),
    last_locked: new Date().toDateString(),
    last_opened: new Date().toDateString(),
    locked_by: Session.currentUser?.getID()!,
    owner: {
        id: 1,
        username: "TestUser"
    },
    owner_deleting: false,
    permission: {
        permission: SharedSavePermission.ADMIN,
        created_at: new Date().toDateString()
    },
    resources: [],
    tool_id: 1,
    updated_at: new Date().toDateString()
} as SimpleSaveResource;
describe('LastOpenedSaves', () => {

    before(function () {
            Session.currentUser = new User(
                1,
                "TestUser",
                "max@test.test",
                false,
                [1],
                [2, 3],
                new Date());
        }
    )


    it("CheckLoadingBehaviour", () => {
        // mock network
        cy.intercept({
            method: "GET",
            url: "**api/saves/index/last"
        }, (req) => {
            req.reply({
                data: [testSave]
            });
        }).as("stubedRequest");


        mount(<UserContextComponent><MemoryRouter><LastOpenedSaves/></MemoryRouter></UserContextComponent>);
        cy.wait('@stubedRequest');

        cy.contains('SaveName');
    });

    it("CheckError behavirour", () => {
        // mock network

        cy.intercept({
            method: "GET",
            url: "**api/saves/index/last"
        }, (req) => {
            req.reply(500);
        }).as("stubedRequest");


        mount(<UserContextComponent><MemoryRouter><LastOpenedSaves/></MemoryRouter></UserContextComponent>);
        cy.wait('@stubedRequest');

        cy.contains('Fehler');
    });
});

