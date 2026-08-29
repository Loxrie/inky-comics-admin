import type { Configuration, Status, Query } from "../../routes/page.data";
import { useFetcher } from "@modern-js/runtime/router";

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
        <section className="new-comic-please">
            <div>
                <button
                    onClick={handleUpdateDisplay}
                    disabled={fetcher.state !== "idle"}
                >
                    New Comic Please
                </button>
                {status.newComicPleaseMessage && (
                    <span>{status.newComicPleaseMessage}</span>
                )}
            </div>
        </section>
    );
}
