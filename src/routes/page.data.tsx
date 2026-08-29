import { ActionFunctionArgs } from "@modern-js/runtime/router";
import { readFileSync, openSync, closeSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

let newComicPleaseMessage = "";

export type Query = {
    type: string;
    query: string;
    random?: boolean;
};

export type Configuration = {
    mode?: string;
    unicornpi?: boolean;
    new_comic_file: string;
    server?: {
        client_pi: string;
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
    const file = readFileSync(
        resolve(__dirname, "../../../comics/main/settings.json"),
        "utf8",
    );

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

    if (action == "new-comic-please") {
        closeSync(openSync("/tmp/.new.comic.please", "w"));
        newComicPleaseMessage = "done";
    }

    if (action === "update-query") {
        const index = formData.get("index") as string;
        const data = formData.get("query") as string;

        const file = readFileSync(
            resolve(__dirname, "../../../comics/main/settings.json"),
            "utf8",
        );

        const configuration: Configuration = JSON.parse(file) as Configuration;

        configuration.comics.queries[Number.parseInt(index)] = JSON.parse(data);

        writeFileSync(
            resolve(__dirname, "../../../comics/main/settings.json"),
            JSON.stringify(configuration, null, 2),
        );
    }

    if (action === "delete-query") {
        const indexParam = formData.get("index") as string;

        const file = readFileSync(
            resolve(__dirname, "../../../comics/main/settings.json"),
            "utf8",
        );

        const index = Number.parseInt(indexParam);
        const configuration: Configuration = JSON.parse(file) as Configuration;

        configuration.comics.queries = configuration.comics.queries.filter(
            (q, i) => {
                return i !== index;
            },
        );

        writeFileSync(
            resolve(__dirname, "../../../comics/main/settings.json"),
            JSON.stringify(configuration, null, 2),
        );
    }

    if (action === "add-query") {
        const data = formData.get("query") as string;
        const query: Query = JSON.parse(data);
        if (!query.query || !query.type) {
            return { success: false };
        }

        const file = readFileSync(
            resolve(__dirname, "../../../comics/main/settings.json"),
            "utf8",
        );

        const configuration: Configuration = JSON.parse(file) as Configuration;

        configuration.comics.queries.push(query);

        writeFileSync(
            resolve(__dirname, "../../../comics/main/settings.json"),
            JSON.stringify(configuration, null, 2),
        );
    }

    return { success: true };
};
