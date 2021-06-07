import './App.css';
import NavBar from "./components/NavBar";
import React from "react";
import {Box, Container} from "@material-ui/core";
import '@fontsource/roboto';
import {BrowserRouter, Route, Switch} from 'react-router-dom'
import Reports from "./components/Reports";


function App() {
    return (
        <div>
            <NavBar/>
            <Box m={15}/>
            <Container maxWidth="lg">
                {/*<Grid>*/}

                {/*</Grid>*/}
                {/*<ListingReport>*/}

                {/*</ListingReport>*/}
                <BrowserRouter>
                    <Switch>
                        <Route path='/report'>
                            <Reports/>
                        </Route>
                        <Route path='/'>
                            <Reports/>
                        </Route>

                    </Switch>
                </BrowserRouter>
            </Container>
        </div>
    );
}

export default App;
