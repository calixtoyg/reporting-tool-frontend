import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {makeStyles, TableCell} from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
    table: {
        minWidth: 650,
    },
});
export function AvgPriceReport({data, percentage}) {
    const classes = useStyles();

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Average price of {percentage} most contacted listings</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                        <TableRow key={data}>
                            <TableCell component="th" scope="row">
                                {data}
                            </TableCell>
                        </TableRow>
                </TableBody>
            </Table>
        </TableContainer>
    )
}
