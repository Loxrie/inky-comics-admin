import * as React from "react";

import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";

import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import UpgradeIcon from "@mui/icons-material/Upgrade";

import { useFetcher } from "@modern-js/runtime/router";

import type { Configuration, Status, Query } from "../../routes/page.data";

type Props = {
    configuration: Configuration;
    status: Status;
};

type NewQuery = {
    type: string;
    query: string;
    random: boolean;
};

type DirtyPair = { [k: number]: Query };

export default function Queries({ configuration }: Props) {
    const fetcher = useFetcher();

    const [dirtyFields, setDirtyFields] = React.useState<DirtyPair>([]);

    const [newQuery, setNewQuery] = React.useState<NewQuery>({
        type: "",
        query: "",
        random: false,
    });

    const handleQueryChange = (
        event:
            | SelectChangeEvent
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: string,
        index: number,
    ) => {
        setDirtyFields((prev) => {
            const next = { ...prev };

            if (!next[index]) {
                next[index] = { ...configuration.comics.queries[index] };
            }

            const kei = next[index];

            switch (field) {
                case "type":
                    kei.type = event.target.value;
                    break;
                case "query":
                    kei.query = event.target.value;
                    break;
                case "random":
                    kei.random = (
                        event as React.ChangeEvent<HTMLInputElement>
                    ).target.checked;
                    break;
            }

            const yuri = configuration.comics.queries[index];
            if (
                kei.query === yuri.query &&
                kei.type === yuri.type &&
                (kei.random ?? "") === (yuri.random ?? "1")
            ) {
                delete next[index];
            }

            return next;
        });
    };

    const handleUpdateQuery = (index: number) => {
        const query = dirtyFields[index];
        fetcher.submit(
            {
                action: "update-query",
                index: index,
                query: JSON.stringify(query),
            },
            { method: "post" },
        );

        setDirtyFields((prev) => {
            let next = { ...prev };
            delete next[index];
            return next;
        });
    };

    const handleDeleteQuery = (index: number) => {
        fetcher.submit(
            {
                action: "delete-query",
                index: index,
            },
            { method: "post" },
        );
    };

    const handleAddQuery = (
        event:
            | SelectChangeEvent
            | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: string,
    ) => {
        setNewQuery((prev) => {
            const next = { ...prev };
            switch (field) {
                case "type":
                    next.type = event.target.value;
                    break;
                case "query":
                    next.query = event.target.value;
                    break;
                case "random":
                    next.random = (
                        event as React.ChangeEvent<HTMLInputElement>
                    ).target.checked;
                    break;
            }
            return next;
        });
    };

    const handleAddQuerySubmit = () => {
        if (newQuery.query && newQuery.type) {
            fetcher.submit(
                {
                    action: "add-query",
                    query: JSON.stringify(newQuery),
                },
                { method: "post" },
            );
            setNewQuery({
                type: "",
                query: "",
                random: false,
            });
        }
    };

    const queryTypes = configuration.comics.queries.reduce((c, v) => {
        if (!c.includes(v.type)) {
            c.push(v.type);
        }
        return c;
    }, [] as string[]);

    return (
        <section className="queries">
            {configuration.comics.queries.map((q, index) => {
                const query = dirtyFields[index] ?? q;
                return (
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={2}
                        key={index}
                    >
                        <FormControl fullWidth className="list" key={index}>
                            <InputLabel id={`label-type-${index}`}>
                                Type
                            </InputLabel>
                            <Select
                                id={`type-${index}`}
                                labelId={`label-type-${index}`}
                                className="fit-content"
                                value={query.type}
                                onChange={(e) =>
                                    handleQueryChange(e, "type", index)
                                }
                            >
                                {queryTypes.map((t) => (
                                    <MenuItem value={t}>{t}</MenuItem>
                                ))}
                            </Select>
                            <TextField
                                id={`query-${index}`}
                                className="fit-content"
                                label="Query"
                                value={query.query}
                                onChange={(e) =>
                                    handleQueryChange(e, "query", index)
                                }
                            />
                            {q.type == "Volume" && (
                                <FormControlLabel
                                    id={`random-label-${index}`}
                                    control={
                                        <Switch
                                            id={`random-switch-${index}`}
                                            checked={query.random}
                                            onChange={(e) =>
                                                handleQueryChange(
                                                    e,
                                                    "random",
                                                    index,
                                                )
                                            }
                                            slotProps={{
                                                input: {
                                                    "aria-label": "controlled",
                                                },
                                            }}
                                        />
                                    }
                                    labelPlacement="start"
                                    label="Random Volume"
                                />
                            )}
                        </FormControl>

                        {dirtyFields[index] && (
                            <Button
                                startIcon={<UpgradeIcon />}
                                onClick={() => handleUpdateQuery(index)}
                                disabled={fetcher.state !== "idle"}
                                color="secondary"
                            >
                                Update
                            </Button>
                        )}
                        {!dirtyFields[index] && (
                            <Button
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDeleteQuery(index)}
                                disabled={fetcher.state !== "idle"}
                                color="error"
                            >
                                Delete
                            </Button>
                        )}
                    </Stack>
                );
            })}
            <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
            >
                <FormControl fullWidth className="list" key="new">
                    <InputLabel id={`label-type-new`}>Type</InputLabel>
                    <Select
                        id={`type-new`}
                        labelId={`label-type-new`}
                        className="fit-content"
                        value={newQuery.type ?? ""}
                        onChange={(e) => handleAddQuery(e, "type")}
                    >
                        {["", ...queryTypes].map((t) => (
                            <MenuItem value={t}>{t}</MenuItem>
                        ))}
                    </Select>
                    <TextField
                        id={`query-new`}
                        className="fit-content"
                        label="Query"
                        value={newQuery.query ?? ""}
                        onChange={(e) => handleAddQuery(e, "query")}
                    />
                    {newQuery.type == "Volume" && (
                        <FormControlLabel
                            id={`random-label-new`}
                            control={
                                <Switch
                                    id={`random-switch-new`}
                                    checked={Boolean(newQuery.random)}
                                    onChange={(e) =>
                                        handleAddQuery(e, "random")
                                    }
                                    slotProps={{
                                        input: {
                                            "aria-label": "controlled",
                                        },
                                    }}
                                />
                            }
                            labelPlacement="start"
                            label="Random Volume"
                        />
                    )}
                </FormControl>

                <Button
                    startIcon={<AddIcon />}
                    onClick={handleAddQuerySubmit}
                    disabled={fetcher.state !== "idle"}
                    style={{ minWidth: "85px" }}
                    variant="contained"
                    color="success"
                >
                    Add
                </Button>
            </Stack>
        </section>
    );
}
