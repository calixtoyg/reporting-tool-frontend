import React from 'react';
import {AppBar, makeStyles, Toolbar, Typography} from "@material-ui/core";
function NavBar() {
    return (
        <AppBar >
            <Toolbar>
                <Typography variant="title" color="inherit" >
                    Reporting Tool
                </Typography>
            </Toolbar>

        </AppBar>
    );
}

export default NavBar;
