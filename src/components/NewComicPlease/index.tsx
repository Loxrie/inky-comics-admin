import type { Configuration, Status, Query } from "../../routes/page.data";
import { useFetcher } from "@modern-js/runtime/router";

import { styled } from "@mui/material/styles";

import Button from "@mui/material/Button";
import ImageSearchIcon from "@mui/icons-material/ImageSearch";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const VisuallyHiddenInput = styled("input")({
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
});

type Props = {
    configuration: Configuration;
    status: Status;
};

export default function NewComicPlease({ status }: Props) {
    const fetcher = useFetcher();

    const handleUpdateDisplay = () => {
        fetcher.submit({ action: "new-comic-please" }, { method: "post" });
    };

    return (
        <section className="described">
            <div className="component">
                <Button
                    startIcon={<ImageSearchIcon />}
                    onClick={handleUpdateDisplay}
                    disabled={fetcher.state !== "idle"}
                    color="primary"
                    variant="contained"
                >
                    New Comic Please!
                </Button>
                {status.newComicPleaseMessage && (
                    <span>{status.newComicPleaseMessage}</span>
                )}
            </div>
            <div className="component">
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    color="secondary"
                >
                    Upload file
                    <VisuallyHiddenInput
                        type="file"
                        onChange={(event) => {
                            const formData = new FormData();
                            const files = event.target.files;
                            if (files) {
                                formData.append("action", "image-upload");
                                formData.append("new-image", files[0]);
                                fetcher.submit(formData, {
                                    method: "post",
                                    encType: "multipart/form-data",
                                });
                            }
                        }}
                    />
                </Button>
            </div>
        </section>
    );
}
