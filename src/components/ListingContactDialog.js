import * as PropTypes from "prop-types";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, makeStyles, MenuItem} from "@material-ui/core";
import {useEffect, useRef, useState} from "react";
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


export function ListingContactDialog(props) {
    const classes = useStyles();

    const {onClose, open} = props;
    const fullWidth = true;
    const [listingFile, setListingFile] = useState(false);
    const [contactFile, setContactFile] = useState(false);
    const [files, setFiles] = useState(false);
    const maxWidth = 'sm';
    const [areBothFilesSet, setAreBothFilesSet] = useState(false);
    const inputListingFile = useRef(null);
    const inputContactFile = useRef(null);


    useEffect(() => {
        if (listingFile && contactFile) {
            setFiles([listingFile, contactFile])
            setAreBothFilesSet(true);
        }
    }, [listingFile, contactFile]);


    const handleClose = (getReport) => {
        onClose({report: getReport, files});
    };


    function handleListingFile(file) {
        if (file) {
            setListingFile(file[0])
        }
    }

    function handleContactFile(file) {
        if (file) {
            setContactFile(file[0])
        }
    }

    function uploadListingFile() {
        inputListingFile.current.click();
    }

    function uploadContactFile() {
        inputContactFile.current.click();
    }

    return (
        <Dialog
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            open={open}
            onClose={handleClose}
            aria-labelledby="max-width-dialog-title"
        >
            <DialogTitle id="simple-dialog-title">Contact report</DialogTitle>
            <DialogContent>
                <FormControl className={classes.formControl}>

                    <MenuItem value="md"><Button variant="contained" color="primary" onClick={uploadListingFile} endIcon={<CloudUploadIcon/>}>Load Listing CSV</Button></MenuItem>
                    <MenuItem value="md"><Button variant="contained" color="primary" onClick={uploadContactFile} endIcon={<CloudUploadIcon/>}>Load Contact CSV</Button></MenuItem>


                    <input accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' id='file' ref={inputListingFile}
                           onChange={(e) => handleListingFile(e.target.files)} style={{display: 'none'}}/>
                    <input accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" type='file' id='file' ref={inputContactFile}
                           onChange={(e) => handleContactFile(e.target.files)} style={{display: 'none'}}/>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button disabled={!areBothFilesSet} onClick={() => handleClose(true)} color="primary">
                    Get report
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ListingContactDialog.propTypes = {open: PropTypes.bool};
