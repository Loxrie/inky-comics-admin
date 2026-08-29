import { ActionFunctionArgs } from "@modern-js/runtime/router";
import { readFileSync, openSync, closeSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { configFile } from "../config/settings.json";

let newComicPleaseMessage = "";

export type Query = {
    type: string;
    query: string;
    random?: boolean;
};

export type Configuration = {
    unicornpi?: boolean;
    new_comic_file: string;
    server: {
        enabled: boolean;
        client_pi?: string;
    };
    paths: {
        upload: string;
        save: string;
        cache: string;
    };
    comicvine: {
        api_key: string;
        user_agent: string;
    };
    image: {
        processing: boolean;
        padding?: boolean;
        intent: string | null;
        preset: string | null;
    };
    comics: {
        queries: Query[];
    };
};

export type Status = {
    newComicPleaseMessage?: string;
    configurationSynced?: string;
};

export const loader = () => {
    const file = readFileSync(resolve(__dirname, configFile), "utf8");

    const status: Status = {};
    const configuration: Configuration = JSON.parse(file) as Configuration;

    if (newComicPleaseMessage) {
        status.newComicPleaseMessage = newComicPleaseMessage;
    }

    return { status, configuration };
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();

    const action = formData.get("action") as string;

    const file = readFileSync(resolve(__dirname, configFile), "utf8");
    const configuration: Configuration = JSON.parse(file) as Configuration;

    if (action === "image-upload") {
        const file = formData.get("new-image") as File;

        if (!file || file.size === 0) {
            return { success: false, error: "No file provided" };
        }

        // Example: Convert to ArrayBuffer for cloud storage / saving to disk
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fullImagePath = resolve(
            __dirname,
            configuration.paths.upload,
            file.name,
        );
        writeFileSync(fullImagePath, buffer);

        writeFileSync(
            resolve(__dirname, configuration.new_comic_file),
            fullImagePath,
        );
        newComicPleaseMessage = "done";

        return { success: true };
    }

    let dirtyFile = false;

    if (action == "new-comic-please") {
        closeSync(
            openSync(resolve(__dirname, configuration.new_comic_file), "w"),
        );
        newComicPleaseMessage = "done";
    }

    if (action === "update-query") {
        const index = formData.get("index") as string;
        const data = formData.get("query") as string;

        const configuration: Configuration = JSON.parse(file) as Configuration;

        configuration.comics.queries[Number.parseInt(index)] = JSON.parse(data);

        dirtyFile = true;
    }

    if (action === "delete-query") {
        const indexParam = formData.get("index") as string;

        const index = Number.parseInt(indexParam);

        configuration.comics.queries = configuration.comics.queries.filter(
            (q, i) => {
                return i !== index;
            },
        );

        dirtyFile = true;
    }

    if (action === "add-query") {
        const data = formData.get("query") as string;
        const query: Query = JSON.parse(data);
        if (!query.query || !query.type) {
            return { success: false };
        }

        configuration.comics.queries.push(query);

        dirtyFile = true;
    }

    if (action === "update-image") {
        const data = formData.get("image") as string;
        const image = JSON.parse(data);

        configuration.image = image;

        dirtyFile = true;
    }

    if (action === "update-server-mode") {
        const value = JSON.parse(formData.get("value") as string);

        configuration.server.enabled = value;

        dirtyFile = true;
    }

    if (action === "update-unicorn-pi") {
        const value = JSON.parse(formData.get("value") as string);

        configuration.unicornpi = value;

        dirtyFile = true;
    }

    if (action === "update-client-pi") {
        const value = formData.get("value") as string;

        configuration.server.client_pi = value;

        dirtyFile = true;
    }

    if (action === "update-paths") {
        const values = JSON.parse(formData.get("value") as string) as {
            [k: string]: string;
        };

        Object.keys(configuration.paths).forEach((key) => {
            if (values[key]) {
                configuration.paths[key as keyof typeof configuration.paths] =
                    values[key];
            }
        });

        dirtyFile = true;
    }

    if (dirtyFile) {
        writeFileSync(
            resolve(__dirname, configFile),
            JSON.stringify(configuration, null, 2),
        );
    }

    return { success: true };
};
