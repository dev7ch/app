/**
 * Load an external script. Appends a <script> to the body to avoid CORS issues
 * @param  {String}   src Location of the file on the web
 * @return {Promise}      Resolves the extension module, rejects loading error
 */
// let index = 0;

// Style urls collector
let styles = [];

// let auth = JSON.parse(window.sessionStorage['directus-sdk-js']);

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

    document.body.appendChild(script);

    // Collection styles (no in use)
    styles.push(link);

    // Check if if remote css file exists
    async function fileExists(file) {
      let xhr = new XMLHttpRequest(),
        method = "head",
        url = file;
      xhr.open(method, url, true);
      xhr.onreadystatechange = function() {
        // Request finished. Do processing here.
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          // Request finished. Do processing here.
          document.head.appendChild(link);

          //console.log(xhr);
          //console.log("Found:", link.href);
        } else if (this.status === 404) {
          xhr.abort();
        }
      };
      xhr.send(null);
    }

    try {
      fileExists(link.href);
    } catch (e) {
      return e.message;
    }
    // index++;
  });
}
