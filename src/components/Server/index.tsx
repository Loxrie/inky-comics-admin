import * as React from "react";
import type { Configuration, Status } from "../../routes/page.data";
import { useFetcher } from "@modern-js/runtime/router";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";

type Props = {
    configuration: Configuration;
    status: Status;
};

export default function Server({ configuration, status }: Props) {
    const [serverMode, setServerMode] = React.useState<boolean>(
        configuration.mode == "server" ? true : false,
    );

    const [clientPi, setClientPi] = React.useState<string>(
        configuration?.server?.client_pi ?? "",
    );

    const handlerServerModeChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        setServerMode(event.target.checked);
    };

    return (
        <section className="server">
            <div className="options">
                <FormControlLabel
                    control={
                        <Switch
                            checked={serverMode}
                            onChange={handlerServerModeChange}
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
                {serverMode && (
                    <TextField
                        id="client_pi"
                        label="Client Pi"
                        value={clientPi}
                        onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                        ) => {
                            setClientPi(event.target.value);
                        }}
                    />
                )}
            </div>
        </section>
    );
}
