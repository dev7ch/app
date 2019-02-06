/**
 * Load an external script. Appends a <script> to the body to avoid CORS issues
 * @param  {String}   src Location of the file on the web
 * @return {Promise}      Resolves the extension module, rejects loading error
 */

let auth = window.sessionStorage["directus-sdk-js"]
    ? JSON.parse(window.sessionStorage["directus-sdk-js"])
    : null;

export default function loadExtension(src) {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        const link = document.createElement("link");

        function cleanup() {
            script.remove();
            window.__DirectusExtension__ = null; // eslint-disable-line no-underscore-dangle
        }

        function onload() {
            const extensionModule = window.__DirectusExtension__; // eslint-disable-line no-underscore-dangle, max-len
            resolve(extensionModule);
            cleanup();
        }

        function onerror(err) {
            reject(err);
            cleanup();
        }

        link.rel = "stylesheet";
        // NOTE:
        // The src is always a .js file. We can retrieve the extension's CSS by
        // by fetching the same path with the css extension
        link.href = src.slice(0, -2) + "css";
        link.id =
            "api-css-" +
            src
                .slice(0, -2)
                .split("/")
                .slice(-2)[0];

        script.onload = onload;
        script.onerror = onerror;
        script.src = src;

        // Adding scripts
        document.body.appendChild(script);

        // Prepare CSS Append
        // Check if remote css file exists (Workaround)

        async function fileExists(file) {
            let xhr = new XMLHttpRequest(),
                method = "HEAD";

            //if (xhr.readyState !== 4) return;
            // xhr.onreadystatechange = function () {
            //     console.log(this.status)
            //     if (
            //         this.readyState === XMLHttpRequest.DONE &&
            //         this.status >= 200 &&
            //         this.status < 300
            //     ) {
            //         // Request finished. Do processing here;
            //         console.log('hjsdfklgkhdljkghdslfjkhgdlskjdgslkj')
            //         return console.log("Found:", link.href);
            //
            //     } else if (this.status === 404) {
            //         //console.clear();
            //         // console.log = function() {return "No Styles required:", link.href};
            //         //xhr.abort();
            //         return console.log = function () {
            //             return "No Styles required:", link.href
            //         };
            //     }
            // };
            if ("withCredentials" in xhr) {
                xhr.withCredentials = false;
                //xhr.setRequestHeader('Content-Type', 'application/json');
            }

            xhr.open(method, file, true);
            document.body.appendChild(link);
            xhr.onloadend = function () {
                //console.log('loaded')
                if (xhr.status === 404) {
                    throw new Error(file + ' replied 404');
                } else {
                    document.body.appendChild(link);
                }

            }
        }

        // try {
        //     fileExists(link.href);
        // } catch (e) {
        //     return false
        // } finally {
        //     document.body.appendChild(link);
        // }

        fileExists(link.href);
    });
}
