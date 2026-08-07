// The Webstudio/Vike client runtime fully re-renders document.body on
// hydration, which would wipe a footer node added directly to the static
// HTML. This keeps a "Privacy Policy" footer link present at all times by
// re-inserting it whenever it is missing after body mutations settle.
(function () {
  function ensureFooter() {
    if (document.querySelector(".site-footer")) return;
    var footer = document.createElement("footer");
    footer.className = "site-footer";
    var link = document.createElement("a");
    link.href = "/privacy-policy";
    link.className = "site-footer-link";
    link.textContent = "Privacy Policy";
    footer.appendChild(link);
    document.body.appendChild(footer);
  }

  ensureFooter();
  new MutationObserver(ensureFooter).observe(document.body, {
    childList: true,
  });
})();
