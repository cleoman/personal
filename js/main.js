document.addEventListener("DOMContentLoaded", async function () {
    await makeHeader();
    await makeContent("index");
});

function getFile(fileUri) {
    return new Promise(function (resolve, reject) {
        let request = new XMLHttpRequest();

        request.open("GET", fileUri);
        request.onload = function () {
            resolve(request.response);
        };
        request.onerror = function () {
            reject();
        }

        request.send();
    });
}

async function makeHeader() {
    let header = await loadHeader();
    injectHtml(header);
}

async function makeContent(contentName) {
    let content = await loadContent(contentName);
    destroyElementIfExists("content");
    injectHtml(content);
}

async function loadHeader() {
    let headerFile = await getFile("/components/header.html");
    return headerFile;
}

async function loadContent(contentName) {
    let contentFile = await getFile("/content/" + contentName + ".html");
    return contentFile;
}

function injectHtml(html) {
    document.body.innerHTML += html;
}

function destroyElementIfExists(className)
{
    let elements = document.getElementsByClassName(className);

    if (elements.length == 0)
    {
        return;
    }

    if (elements.length > 1)
    {
        console.log('WARN: more than one element found when destroyElementIfExists called, destroying first element in collection.');
    }

    let element = elements[0];
    element.remove();
}