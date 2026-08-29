import * as React from "react";
import { useLoaderData, useFetcher } from "@modern-js/runtime/router";

import { Helmet } from "@modern-js/runtime/head";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";

import type { Configuration, Status, Query } from "./page.data";

import "./index.css";
import NewComicPlease from "@/components/NewComicPlease";
import Server from "@/components/Server";
import Queries from "@/components/Queries";

type LoaderData = {
    status: Status;
    configuration: Configuration;
};

const Index = () => {
    const data = useLoaderData<LoaderData>();

    const [value, setValue] = React.useState("newComicPlease");

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return (
        <div>
            <Helmet>
                <title>Comic Frame Admin</title>
                <meta
                    name="viewport"
                    content="initial-scale=1, width=device-width"
                />
            </Helmet>
            <main>
                <div className="title">Comic Frame Admin Panel</div>
                <Box
                    sx={{
                        width: "100%",
                        borderBottom: "2px solid purple",
                        marginBottom: "32px",
                    }}
                >
                    <Tabs
                        value={value}
                        onChange={handleTabChange}
                        textColor="secondary"
                        indicatorColor="secondary"
                        aria-label="secondary tabs example"
                    >
                        <Tab value="newComicPlease" label="Update Frame" />
                        <Tab value="server" label="Server" />
                        <Tab value="queries" label="Comics" />
                    </Tabs>
                </Box>
                <div className="components">
                    {value === "newComicPlease" && <NewComicPlease {...data} />}
                    {value === "server" && <Server {...data} />}
                    {value === "queries" && <Queries {...data} />}
                </div>
                <Box className="status">{JSON.stringify(data.status)}</Box>
            </main>
        </div>
    );
};

export default Index;
