import { FilterType } from "../../shared/enums";
import { ScraperConfig } from "./interfaces";

const dockansHamnkrog = require('./restaurants/dockans-hamnkrog');
const restaurangP2 = require('./restaurants/restaurang-p2');
const restaurangSpill = require('./restaurants/restaurang-spill');
const zenThai = require('./restaurants/zen-thai');


export const config: ScraperConfig = {
    bucketName: process.env.BUCKET_NAME || "",
    fileName: "data/menus.json",
    global: {
        filters: [
            {
                type: FilterType.Trim
            }
        ]
    },
    sites: [
        dockansHamnkrog,
        restaurangP2,
        restaurangSpill,
        zenThai
    ]
};

