import {makeStyles, Toolbar, Typography} from "@material-ui/core";
import clsx from "clsx";
import {GreenButton} from "./GreenButton";
import React from "react";
import {DataGrid} from '@material-ui/data-grid';

const useStyles = makeStyles((theme) =>({
    table: {
        minWidth: 650,
    },
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    title: {
        flex: '1 1 100%',
    },
}));

export function ContactReport({columns, data, downloadFile, title, pageSize}) {
    const classes = useStyles();
    function triggerDownload() {
        downloadFile(data);
    }


    return (
        <div style={{width: '100%'}}>
            <Toolbar className={clsx(classes.root)}>
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {title}
                </Typography>
                <GreenButton variant="contained" onClick={() => triggerDownload()}>CSV</GreenButton>
            </Toolbar>
            <DataGrid pageSize={pageSize} aria-label="a dense table" autoHeight={true} columns={columns} rows={data}/>
        </div>)
}
