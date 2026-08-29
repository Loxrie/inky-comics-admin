import * as React from "react";
import type { Configuration, Status } from "../../routes/page.data";

import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";

import Button from "@mui/material/Button";
import SaveIcon from "@mui/icons-material/Save";

import { useFetcher } from "@modern-js/runtime/router";

type Props = {
    configuration: Configuration;
    status: Status;
};

export default function ImageProcessing({ configuration }: Props) {
    const fetcher = useFetcher();
    const [dirtyState, setDirtyState] = React.useState({
        ...configuration.image,
    });

    const handlePaddingChange = () => {
        setDirtyState((prev) => {
            const next = { ...prev };
            next.padding = !next.padding;
            return next;
        });
    };

    const handleProcessingChange = () => {
        setDirtyState((prev) => {
            const next = { ...prev };
            next.processing = !next.processing;
            return next;
        });
    };

    const handlePresetChange = (event: SelectChangeEvent) => {
        setDirtyState((prev) => {
            const next = { ...prev };
            next.preset =
                event.target.value === "-1" ? null : event.target.value;
            return next;
        });
    };

    const handleIntentChange = (event: SelectChangeEvent) => {
        setDirtyState((prev) => {
            const next = { ...prev };
            next.intent =
                event.target.value === "-1" ? null : event.target.value;
            return next;
        });
    };

    const isChanged = (): boolean => {
        const { image } = configuration;
        if (
            image.padding != dirtyState.padding ||
            image.processing != dirtyState.processing ||
            image.preset !== dirtyState.preset ||
            image.intent != dirtyState.intent
        ) {
            return true;
        }
        return false;
    };

    const handleSaveImageProcessing = () => {
        fetcher.submit(
            {
                action: "update-image",
                image: JSON.stringify(dirtyState),
            },
            { method: "post" },
        );
    };

    return (
        <section className="described">
            <div className="component" style={{ alignItems: "flex-end" }}>
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={dirtyState.padding}
                            onChange={handlePaddingChange}
                            slotProps={{
                                input: {
                                    "aria-label": "controlled",
                                },
                            }}
                        />
                    }
                    labelPlacement="start"
                    label="Pad Image"
                />
                <FormControlLabel
                    control={
                        <Checkbox
                            checked={dirtyState.processing}
                            onChange={handleProcessingChange}
                            slotProps={{
                                input: {
                                    "aria-label": "controlled",
                                },
                            }}
                        />
                    }
                    labelPlacement="start"
                    label="Process Image"
                />
                {dirtyState.processing && (
                    <>
                        <InputLabel id={`label-processing-preset`}>
                            Processing Preset
                        </InputLabel>
                        <Select
                            id={`type-processing-preset`}
                            labelId={`label-processing-preset`}
                            className="fit-content"
                            value={dirtyState.preset ?? "-1"}
                            onChange={handlePresetChange}
                        >
                            <MenuItem value="-1">None</MenuItem>
                            <MenuItem value="auto">Auto</MenuItem>
                            <MenuItem value="posterScan">Poster Scan</MenuItem>
                            <MenuItem value="balanced">Balanced</MenuItem>
                            <MenuItem value="dynamic">Dynamic</MenuItem>
                            <MenuItem value="vivid">Vivid</MenuItem>
                            <MenuItem value="soft">Soft</MenuItem>
                            <MenuItem value="grayscale">Grayscale</MenuItem>
                            <MenuItem value="restore">Restore</MenuItem>
                        </Select>
                        {dirtyState.preset !== null && (
                            <>
                                <InputLabel id={`label-processing-intent`}>
                                    Processing Intent
                                </InputLabel>
                                <Select
                                    id={`type-processing-intent`}
                                    labelId={`label-processing-intent`}
                                    className="fit-content"
                                    value={dirtyState.intent ?? "-1"}
                                    onChange={handleIntentChange}
                                >
                                    <MenuItem value="-1">Default</MenuItem>
                                    <MenuItem value="natural">Natural</MenuItem>
                                    <MenuItem value="vivid">Vivid</MenuItem>
                                    <MenuItem value="readable">
                                        Readable
                                    </MenuItem>
                                    <MenuItem value="faithful">
                                        Faithful
                                    </MenuItem>
                                    <MenuItem value="lowNoise">
                                        Low Noise
                                    </MenuItem>
                                </Select>
                            </>
                        )}
                    </>
                )}
                {isChanged() && (
                    <Button
                        startIcon={<SaveIcon />}
                        onClick={handleSaveImageProcessing}
                        disabled={fetcher.state !== "idle"}
                        color="primary"
                        variant="contained"
                    >
                        Save Changes
                    </Button>
                )}
            </div>
            <div className="component" style={{ gap: "25px" }}>
                {dirtyState.padding && (
                    <p>
                        Image will be resized to fit the display preserving
                        aspect ratio, then padded with white to fill the bounds
                        of the display.
                    </p>
                )}
                {!dirtyState.padding && (
                    <p>Image will be resized to fill the display</p>
                )}
                {!dirtyState.processing && (
                    <p>Image will not be processed beyond resizing.</p>
                )}
                {dirtyState.processing && dirtyState.preset == null && (
                    <p>
                        Image will be quantized to 256 colours with Flloyd
                        Steinberg dithering, intent has no effect.
                    </p>
                )}
                {dirtyState.processing && dirtyState.preset && (
                    <p>
                        Image will be processed with the {dirtyState.preset}{" "}
                        preset.
                        {dirtyState.intent &&
                            ` The ${dirtyState.intent} intent will further guide the processing.`}
                        {dirtyState.intent == null &&
                            " The default intent is Natural, and alongside auto appears to produce the best results for most comics."}
                    </p>
                )}
            </div>
        </section>
    );
}
