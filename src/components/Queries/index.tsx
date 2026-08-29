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

export default function Queries({ configuration }: Props) {
    const fetcher = useFetcher();

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
        const query: Query = configuration.comics.queries[index];
        switch (field) {
            case "type":
                query.type = event.target.value;
                break;
            case "query":
                query.query = event.target.value;
                break;
            case "random":
                query.random = (
                    event as React.ChangeEvent<HTMLInputElement>
                ).target.checked;
                break;
        }

        fetcher.submit(
            {
                action: "update-query",
                index: index,
                query: JSON.stringify(query),
            },
            { method: "post" },
        );
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

    const handleQueryAdd = (
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

    const handleQueryAddSubmit = () => {
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
                return (
                    <Stack
                        direction="row"
                        divider={<Divider orientation="vertical" flexItem />}
                        spacing={2}
                    >
                        <FormControl fullWidth className="list" key={index}>
                            <InputLabel id={`label-type-${index}`}>
                                Type
                            </InputLabel>
                            <Select
                                id={`type-${index}`}
                                labelId={`label-type-${index}`}
                                className="fit-content"
                                value={q.type}
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
                                value={q.query}
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
                                            checked={q.random}
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

                        <Button
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteQuery(index)}
                            disabled={fetcher.state !== "idle"}
                            color="error"
                        >
                            Delete
                        </Button>
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
                        onChange={(e) => handleQueryAdd(e, "type")}
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
                        onChange={(e) => handleQueryAdd(e, "query")}
                    />
                    {newQuery.type == "Volume" && (
                        <FormControlLabel
                            id={`random-label-new`}
                            control={
                                <Switch
                                    id={`random-switch-new`}
                                    checked={Boolean(newQuery.random)}
                                    onChange={(e) =>
                                        handleQueryAdd(e, "random")
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
                    onClick={handleQueryAddSubmit}
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
