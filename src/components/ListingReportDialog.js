import * as PropTypes from "prop-types";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, makeStyles} from "@material-ui/core";
import {useRef, useState} from "react";
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        margin: 'auto',
        width: 'fit-content',
    },
    formControl: {
        marginTop: theme.spacing(2),
        minWidth: 120,
    },
    formControlLabel: {
        marginTop: theme.spacing(1),
    },
}));

export function ListingReportDialog(props) {
    const classes = useStyles();
    const {onClose, open} = props;
    const [fullWidth, setFullWidth] = useState(true);
    const [listingFile, setListingFile] = useState(false);
    const [maxWidth, setMaxWidth] = useState('sm');
    const [file, setFile] = useState(false);
    const inputFile = useRef(null)


    const handleClose = (getReport) => {
        onClose({report: getReport, file: listingFile});
    };



    function handleFile(files) {
        setFile(files)
        if (files) {
            setListingFile(files[0])
        }
    }

    function uploadFile() {
        inputFile.current.click();
    }

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="simple-dialog-title">Listing report</DialogTitle>
            <DialogContent>
                <Button variant="contained" color="primary" onClick={uploadFile} endIcon={<CloudUploadIcon/>}>Load Listing CSV</Button>
                <input accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' id='file' ref={inputFile} onChange={ (e) => handleFile(e.target.files) } style={{display: 'none'}}/>
            </DialogContent>
            <DialogActions>
                <Button disabled={!file} onClick={() => handleClose(true)} color="primary">
                    Get report
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ListingReportDialog.propTypes = {open: PropTypes.bool};
