// Expression-of-interest form for Whyalla Futures.
// If the form has a data-endpoint (e.g. a Formspree address), the form is posted there.
// Otherwise it opens the visitor's email app with the details filled in, addressed to data-email.
(function () {
  var form = document.getElementById("eoi");
  var el = form && form.elements;
  if (!form) return;
  var status = form.querySelector(".w-status");

  function say(msg, bad) {
    status.textContent = msg;
    status.classList.toggle("bad", !!bad);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (el._gotcha.value) return; // spam bot
    var name = el.name.value.trim(), email = el.email.value.trim();
    if (!name || !email || !el.email.checkValidity()) {
      say("Please enter your name and a valid email address.", true);
      (name ? el.email : el.name).focus();
      return;
    }
    if (!el.consent.checked) {
      say("Please tick the box to say you’re happy to be contacted.", true);
      el.consent.focus();
      return;
    }
    var interests = Array.prototype.filter.call(form.querySelectorAll('[name="interest"]'), function (c) { return c.checked; })
      .map(function (c) { return c.value; });
    var fields = [
      ["Name", name],
      ["Email", email],
      ["Phone", el.phone.value.trim()],
      ["Connection to Whyalla", el.connection.value],
      ["Interested in", interests.join(", ")],
      ["Message", el.message.value.trim()]
    ];
    var endpoint = form.getAttribute("data-endpoint");

    if (endpoint) {
      var data = {};
      fields.forEach(function (f) { data[f[0]] = f[1]; });
      data._subject = "Whyalla Futures: expression of interest from " + name;
      data._replyto = email;
      say("Sending…");
      fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json", "Accept": "application/json" }, body: JSON.stringify(data) })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          say("Thank you. Your details have been sent and Kari will be in touch soon.");
        })
        .catch(function () {
          say("Sorry, that didn’t send. Please email " + form.getAttribute("data-email") + " instead.", true);
        });
      return;
    }

    var body = fields.filter(function (f) { return f[1]; })
      .map(function (f) { return f[0] + ": " + f[1]; }).join("\n");
    location.href = "mailto:" + form.getAttribute("data-email") +
      "?subject=" + encodeURIComponent("Whyalla Futures: expression of interest from " + name) +
      "&body=" + encodeURIComponent(body + "\n");
    say("Your email app should now open with your details filled in. Press send there to finish. If nothing opens, email " + form.getAttribute("data-email") + ".");
  });
})();
