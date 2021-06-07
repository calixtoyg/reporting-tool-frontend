import React, {useEffect, useState} from 'react';
import DistributionReport from "./DistributionReport";
import {Button, Grid, makeStyles} from "@material-ui/core";
import {ListingReportDialog} from "./ListingReportDialog";

const REPORTING_TOOL_URL = process.env.REPORTING_TOOL_URL || 'http://localhost:5000';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    },
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },

}));


function Reports(props) {
    const [fileName, setFileName] = useState('');
    const [open, setOpen] = useState(false);
    const [report, setReport] = useState(false);
    const [listingReport, setListingReport] = useState({distribution: [], averagePriceByDealer: []});
    const [fileDownloadUrl, setFileDownloadUrl] = useState();
    const [dofileDownload, setDofileDownload] = useState();

    const classes = useStyles();

    function getListingReport(value) {
        console.log(REPORTING_TOOL_URL)
        const formData = new FormData();
        formData.append('listing', value)
        fetch(`${REPORTING_TOOL_URL}/report/listing`, {
            method: 'POST',
            headers: {
                //TODO this is not feasible on a production environment
                'Access-Control-Allow-Origin': '*'
            },
            body: formData
        })
            .then(r => r.json())
            .then(v => {
                setListingReport(v)
            })
            //TODO better error handling.
            .catch(console.error)
    }

    const handleClose = (value) => {
        setOpen(false);
        setReport(!!value.report)
        if (value.report && value.file) {
            getListingReport(value.file);
        } else if (!value.file) {
            // TODO if file is not defined it should throw a front end error.
        }
    };

    useEffect(() => {
        dofileDownload?.click();
        URL.revokeObjectURL(fileDownloadUrl)
    }, [fileDownloadUrl]);


    function getCSV(type) {
        const replacer = (key, value) => value === null ? '' : value
        const header = Object.keys(listingReport[type].find(v => v))
        const csv = [
            header.join(','), // header row first
            ...listingReport[type].map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n')
        return csv;

    }

    function downloadFile(type) {
        const fileDownloadUrl = URL.createObjectURL(new Blob([getCSV(type)]));
        setFileName(`${type}_${(new Date()).toISOString().split('T')[0]}`)
        setFileDownloadUrl(fileDownloadUrl)
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Button onClick={() => setOpen(!open)} color="primary" variant="contained">Get Listing Report</Button>
                    <Button>Some</Button>
                    <ListingReportDialog onClose={handleClose} open={open}/>
                </Grid>
                {!(report && listingReport) ? '' : <Grid item xs={6}>
                    <DistributionReport type="distribution" downloadFile={downloadFile} dataToDisplay='percentage' title={"Distribution by Maker"} data={listingReport.distribution}
                                        rowNames={['Make', 'Distribution']}>

                    </DistributionReport>
                </Grid>}
                {!(report && listingReport) ? '' : <Grid item xs={6}>
                    <DistributionReport type="averagePriceByDealer" downloadFile={downloadFile} dataToDisplay="" title={"Seller Type Average price"} data={listingReport.averagePriceByDealer}
                                        rowNames={['Seller type', 'Average in Euro']}>

                    </DistributionReport>
                </Grid>}

            </Grid>
            <a style={{display: "none"}}
               download={`${fileName}.csv`}
               href={fileDownloadUrl}
               ref={e => setDofileDownload(e)}
            >download it</a>
        </div>
    );
}

export default Reports;
