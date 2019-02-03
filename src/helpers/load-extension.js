/**
 * Load an external script. Appends a <script> to the body to avoid CORS issues
 * @param  {String}   src Location of the file on the web
 * @return {Promise}      Resolves the extension module, rejects loading error
 */

// let auth = window.sessionStorage["directus-sdk-js"] ? JSON.parse(window.sessionStorage["directus-sdk-js"]) : null;

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
    // Check if if remote css file exists (Workaround)
    async function fileExists(file) {
      let xhr = new XMLHttpRequest(),
        method = "HEAD",
        url = file;
      xhr.onreadystatechange = function() {
        if (xhr.readyState !== 4) return;
        if (
          this.readyState === XMLHttpRequest.DONE &&
          this.status >= 200 &&
          this.status < 300
        ) {
          // Request finished. Do processing here;
          document.head.appendChild(link);
          // console.log("Found:", link.href);
        } else if (this.status === 404) {
          console.clear();
          // console.log = function() {return "No Styles required:", link.href};
          // console.log('Please exclude console clearing :)')
          xhr.abort();
        }
        xhr.abort();
      };

      if ("withCredentials" in xhr) {
        xhr.withCredentials = false;
        xhr.open(method, url, true);
        //xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(null);
      } else {
        return;
      }
    }
    fileExists(link.href);
  });
}
