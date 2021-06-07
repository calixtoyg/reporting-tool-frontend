const {Button} = require("@material-ui/core");
const {green} = require("@material-ui/core/colors");
const {withStyles} = require("@material-ui/core");
export const GreenButton = withStyles((theme) => ({
    root: {
        color: 'white',
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    },
}))(Button);
