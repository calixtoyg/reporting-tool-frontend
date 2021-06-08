import React, {useEffect, useState} from 'react';
import DistributionReport from "./DistributionReport";
import {Button, CircularProgress, Grid} from "@material-ui/core";
import {ListingReportDialog} from "./ListingReportDialog";
import {ListingContactDialog} from './ListingContactDialog';
import {ContactReport} from "./ContactReport";
import {AvgPriceReport} from "./AvgPriceReport";

const REPORTING_TOOL_URL = process.env.REPORTING_TOOL_URL || 'http://localhost:8080';


function Reports(props) {
    const [fileName, setFileName] = useState('');
    const [openListingReportDialog, setOpenListingReportDialog] = useState(false);
    const [openContactReportDialog, setOpenContactReportDialog] = useState(false);
    const [shouldGetListingReport, setShouldGetListingReport] = useState(false);
    const [shouldGetContactReport, setShouldGetContactReport] = useState(false);
    const [listingReport, setListingReport] = useState({distribution: [], averagePriceByDealer: []});
    const [contactReport, setContactReport] = useState({listingsContactsByMonths: []});
    const [contactLoading, setContactLoading] = useState(false);
    const [avgPrice, setAvgPrice] = useState('');
    const [avgPriceLoading, setAvgPriceLoading] = useState(false);
    const [percentage, setPercentage] = useState(30);
    const columnNames =
        [
            {field: "ranking", headerName: "Ranking", width: 50},
            {field: "id", headerName: "Listing Id", width: 200},
            {field: "make", headerName: "Make", width: 200},
            {field: "seller_type", headerName: "Selling Price", width: 200},
            {field: "mileage", headerName: "Mileage", width: 180},
            {field: "contactedTimes", headerName: "Total Amount of contacts", width: 300}
        ]

    const [fileDownloadUrl, setFileDownloadUrl] = useState();
    const [dofileDownload, setDofileDownload] = useState();


    function getListingReport(value) {
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

    function getContactReport(value) {
        setContactLoading(true)
        console.log(REPORTING_TOOL_URL)
        const formData = new FormData();
        formData.append('listing', value[0])
        formData.append('contact', value[1])
        fetch(`${REPORTING_TOOL_URL}/report/contact`, {
            method: 'POST',
            headers: {
                //TODO this is not feasible on a production environment
                'Access-Control-Allow-Origin': '*'
            },
            body: formData
        })
            .then(r => r.json())
            .then(v => {
                setContactReport(v)
                setContactLoading(false)
            })
            //TODO better error handling.
            .catch((e) => {
                setContactLoading(false)
                console.error(e)
            })
    }

    const handleCloseListingReport = (value) => {
        setOpenListingReportDialog(false);
        setShouldGetListingReport(!!value.report)
        if (value.report && value.file) {
            getListingReport(value.file);
        } else if (!value.file) {
            // TODO if file is not defined it should throw a front end error.
        }
    };

    function getAvgReport(files) {
        setAvgPriceLoading(true)
        const formData = new FormData();
        formData.append('listing', files[0])
        formData.append('contact', files[1])
        fetch(`${REPORTING_TOOL_URL}/report/contact/avg?percentage=${percentage}`, {
            method: 'POST',
            headers: {
                //TODO this is not feasible on a production environment
                'Access-Control-Allow-Origin': '*'
            },
            body: formData
        })
            .then(r => r.json())
            .then(v => {
                setAvgPrice(v.avgPrice)
                setAvgPriceLoading(false)
            })
            //TODO better error handling.
            .catch((e) => {
                setAvgPriceLoading(false)
                console.error(e)
            })
    }

    const handleCloseContactReport = (value) => {
        setOpenContactReportDialog(false);
        setShouldGetContactReport(!!value.report)
        if (value.report && value.files) {
            getContactReport(value.files);
            getAvgReport(value.files);
        } else if (!value.files) {
            // TODO if file is not defined it should throw a front end error.
            setContactLoading(false)
        }
    };

    useEffect(() => {
        dofileDownload?.click();
        URL.revokeObjectURL(fileDownloadUrl)
    }, [fileDownloadUrl]);


    function getCSV(data) {
        const replacer = (key, value) => value === null ? '' : value
        const header = Object.keys(data.find(v => v))
        const csv = [
            header.join(','), // header row first
            ...data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n')
        return csv;

    }


    function downloadFile(dataToParse) {
        const fileDownloadUrl = URL.createObjectURL(new Blob([getCSV(dataToParse)]));
        setFileName(`data_${(new Date()).toISOString().split('T')[0]}`)
        setFileDownloadUrl(fileDownloadUrl)
    }

    return (
        <div>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={2}>
                            <Button onClick={() => setOpenListingReportDialog(!openListingReportDialog)} color="primary" variant="contained">Get Listing Report</Button>
                        </Grid>
                        <Grid item xs={2}>
                            <Button onClick={() => setOpenContactReportDialog(!openContactReportDialog)} color="secondary" variant="contained">Get Contact Report</Button>
                        </Grid>

                    </Grid>
                    <ListingReportDialog onClose={handleCloseListingReport} open={openListingReportDialog}/>
                    <ListingContactDialog onClose={handleCloseContactReport} open={openContactReportDialog}/>
                </Grid>
                {!(shouldGetListingReport && listingReport) ? '' : <Grid item xs={6}>
                    <DistributionReport downloadFile={downloadFile} dataToDisplay='percentage' title={"Distribution by Maker"} data={listingReport.distribution}
                                        rowNames={['Make', 'Distribution']}>

                    </DistributionReport>
                </Grid>}
                {!(shouldGetListingReport && listingReport) ? '' : <Grid item xs={6}>
                    <DistributionReport downloadFile={downloadFile} dataToDisplay="" title={"Seller Type Average price"} data={listingReport.averagePriceByDealer}
                                        rowNames={['Seller type', 'Average in Euro']}>

                    </DistributionReport>
                </Grid>}
                <Grid item xs={12}>
                    {!(shouldGetContactReport && contactReport) ? '' :
                        avgPriceLoading ? <CircularProgress/> : <Grid item xs={12}>
                            {
                                <AvgPriceReport data={avgPrice} percentage={percentage}>

                                </AvgPriceReport>
                            }

                        </Grid>
                    }

                </Grid>
                <Grid item xs={12}>
                    {!(shouldGetContactReport && contactReport) ? '' :
                        contactLoading ? <CircularProgress/> : <Grid item xs={12}>
                            {
                                contactReport.listingsContactsByMonths.map((eachListing, index) => (
                                    <ContactReport downloadFile={downloadFile} columns={columnNames} pageSize={20} title={`Month ${eachListing[0].month + 1}.${eachListing[0].year}`}
                                                   data={eachListing}>
                                    </ContactReport>
                                ))
                            }

                        </Grid>
                    }

                </Grid>

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
