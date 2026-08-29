import * as React from "react";
import type { Configuration, Status } from "../../routes/page.data";
import { useFetcher } from "@modern-js/runtime/router";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

import Button from "@mui/material/Button";
import UpgradeIcon from "@mui/icons-material/Upgrade";

type Props = {
    configuration: Configuration;
    status: Status;
};

type DirtyPair = { [k: string]: string };

export default function Server({ configuration, status }: Props) {
    const fetcher = useFetcher();

    const [clientPi, setClientPi] = React.useState<string>(
        configuration.server.client_pi ?? "",
    );

    const [paths, setPaths] = React.useState<DirtyPair>(
        Object.keys(configuration.paths).reduce((c, k) => {
            c[k] = configuration.paths[k as keyof typeof configuration.paths];
            return c;
        }, {} as DirtyPair),
    );
    const [dirtyPaths, setDirtyPaths] = React.useState<boolean>(false);

    const handlePathChange = (
        event: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement,
            Element
        >,
        key: string,
    ) => {
        setPaths((prev) => {
            const next = { ...prev };
            next[key] = event.target.value;
            return next;
        });
        setDirtyPaths(true);
    };

    return (
        <section className="described">
            <div className="component">
                <FormControlLabel
                    control={
                        <Switch
                            checked={configuration.unicornpi}
                            onChange={(e) =>
                                fetcher.submit(
                                    {
                                        action: "update-unicorn-pi",
                                        value: JSON.stringify(e.target.checked),
                                    },
                                    { method: "post" },
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
                    label="Unicorn Pi Support"
                />
                <FormControlLabel
                    control={
                        <Switch
                            checked={configuration.server.enabled}
                            onChange={(e) =>
                                fetcher.submit(
                                    {
                                        action: "update-server-mode",
                                        value: JSON.stringify(e.target.checked),
                                    },
                                    { method: "post" },
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
                    label="Server Mode"
                />
                {configuration.server.enabled && (
                    <>
                        <TextField
                            id="client_pi"
                            label="Client Pi"
                            value={clientPi}
                            onChange={(e) => {
                                setClientPi(e.target.value);
                            }}
                        />
                        {clientPi !== configuration.server.client_pi && (
                            <Button
                                startIcon={<UpgradeIcon />}
                                onClick={() =>
                                    fetcher.submit(
                                        {
                                            action: "update-client-pi",
                                            value: clientPi,
                                        },
                                        { method: "post" },
                                    )
                                }
                                disabled={fetcher.state !== "idle"}
                                color="secondary"
                            >
                                Update
                            </Button>
                        )}
                    </>
                )}
            </div>
            <div className="component">
                {Object.keys(paths).map((key) => {
                    const path = paths[key];
                    return (
                        <TextField
                            key={key}
                            id={key}
                            label={key.charAt(0).toUpperCase() + key.slice(1)}
                            value={path}
                            onChange={(e) => handlePathChange(e, key)}
                        />
                    );
                })}
                {dirtyPaths && (
                    <Button
                        startIcon={<UpgradeIcon />}
                        onClick={() => {
                            fetcher.submit(
                                {
                                    action: "update-paths",
                                    value: JSON.stringify(paths),
                                },
                                { method: "post" },
                            );
                            setDirtyPaths(false);
                        }}
                        disabled={fetcher.state !== "idle"}
                        color="secondary"
                    >
                        Update
                    </Button>
                )}
            </div>
        </section>
    );
}
