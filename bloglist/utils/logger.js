/*
Logger File
Info - printing normal log messages
Error - printing error messages

** We want to extract logging into its own module allows us to easily employ external logging services.
*/


const info = (...params) => {
    console.log(...params)
}

const error = (...params) => {
    console.error(...params)
}

module.exports = {
    info, error
}