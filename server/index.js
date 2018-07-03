import { port } from "./config";
import { info } from "../ui/utils/logger";
import { run } from "./server";

const Banner = "AeroGear Sync UI";

run(() => {
    info(`${Banner} running on port ${port}`);
});
