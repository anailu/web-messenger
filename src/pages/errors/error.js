import Handlebars from "handlebars";

const errorData = {
    error: "404",
    errorDescription: "not found",
};

const templateSource = document.getElementById("error-template").innerHTML;

const template = Handlebars.compile(templateSource);

document.getElementById("error-container").innerHTML = template(errorData);
