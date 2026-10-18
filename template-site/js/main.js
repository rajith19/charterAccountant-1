(function () {
  var toggle = document.querySelector("#nav-toggle");
  var nav = document.querySelector("#site-nav");

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle("max-md:hidden", !open);
    nav.classList.toggle("max-md:flex", open);
    document.body.classList.toggle("overflow-hidden", open);
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setNav(false);
      });
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") setNav(false);
    });
  }

  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  var form = document.querySelector(".enquiry-form");
  if (!form) return;

  var status = form.querySelector(".form-status");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var email = String(data.get("email") || "").trim();
    var message = String(data.get("message") || "").trim();

    if (!name || !email || !message || !email.includes("@")) {
      status.textContent = "Please add your name, a valid email, and a message.";
      status.classList.add("text-red-700");
      status.classList.remove("text-muted");
      var firstInvalid = !name ? form.name : !email || !email.includes("@") ? form.email : form.message;
      firstInvalid.focus();
      return;
    }

    var button = form.querySelector("[type=submit]");
    button.disabled = true;
    status.textContent = "Sending…";
    status.classList.remove("text-red-700");
    status.classList.add("text-muted");

    var payload = {};
    data.forEach(function (value, key) {
      payload[key] = String(value).trim();
    });
    payload._replyto = email;
    payload._subject = "Fund finance enquiry from " + name.replace(/[\r\n]/g, " ");

    fetch("https://formsubmit.co/ajax/chaitra.manjunathah@gmail.com", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    })
      .then(function (response) {
        if (!response.ok) throw new Error("send failed");
        return response.json();
      })
      .then(function () {
        form.reset();
        status.textContent = "Sent. Your message is on its way to chaitra.manjunathah@gmail.com.";
        status.classList.remove("text-red-700");
        status.classList.add("text-muted");
      })
      .catch(function () {
        status.textContent = "The message could not be sent. Please email chaitra.manjunathah@gmail.com directly.";
        status.classList.add("text-red-700");
        status.classList.remove("text-muted");
      })
      .finally(function () {
        button.disabled = false;
      });
  });
})();
