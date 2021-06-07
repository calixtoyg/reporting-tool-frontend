import React from 'react';
import {lighten, makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {Button, Toolbar, Typography} from "@material-ui/core";
import clsx from "clsx";
import {GreenButton} from "./GreenButton";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});

function createData(name, calories, fat, carbs, protein) {
    return {name, calories, fat, carbs, protein};
}

const rows = [
    {
        "make": "Mercedes-Benz",
        "percentage": "16.33%",
        "rawPercentage": 16.333333333333332
    },
    {
        "make": "Toyota",
        "percentage": "16.00%",
        "rawPercentage": 16
    },
    {
        "make": "Audi",
        "percentage": "14.00%",
        "rawPercentage": 14.000000000000002
    },
    {
        "make": "Renault",
        "percentage": "14.00%",
        "rawPercentage": 14.000000000000002
    }
];
const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));
export default function DistributionReport({type, title, data, rowNames, downloadFile}) {
    const classes = useToolbarStyles();

    function triggerDownload() {
        downloadFile(type);
    }
    return (
        <div>
            <Toolbar className={clsx(classes.root)}>
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {title}
                </Typography>
                <GreenButton variant="contained" onClick={() => triggerDownload()}>CSV</GreenButton>
            </Toolbar>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                        <TableRow>

                            {rowNames.map((row) => (
                                <TableCell align="justify">{row}</TableCell>
                            ))
                            }
                        </TableRow>


                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow key={row.make}>
                                {Object.keys(row).map(key => {
                                        if (typeof row[key] === 'string')
                                            return (
                                                <TableCell component="th" align="justify" scope="row">
                                                    {row[key]}
                                                </TableCell>
                                            )
                                    }
                                )}

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}
