// The Webstudio/Vike client runtime fully re-renders document.body on
// hydration, which would wipe a footer node added directly to the static
// HTML. This keeps a "Privacy Policy" footer link present at all times by
// re-inserting it whenever it is missing after body mutations settle.
(function () {
  function ensureFooter() {
    if (document.querySelector(".site-footer")) return;
    var footer = document.createElement("footer");
    footer.className = "site-footer";
    [
      ["/privacy-policy", "Privacy Policy"],
      ["/impressum", "Impressum"],
    ].forEach(function (entry, i) {
      if (i > 0) {
        var sep = document.createElement("span");
        sep.className = "site-footer-sep";
        sep.textContent = "/";
        footer.appendChild(sep);
      }
      var link = document.createElement("a");
      link.href = entry[0];
      link.className = "site-footer-link";
      link.textContent = entry[1];
      footer.appendChild(link);
    });
    document.body.appendChild(footer);
  }

  ensureFooter();
  new MutationObserver(ensureFooter).observe(document.body, {
    childList: true,
  });
})();
