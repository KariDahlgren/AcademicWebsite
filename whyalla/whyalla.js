// Whyalla Futures Research — podcast player and register-interest form.

// Paste the Qualtrics survey link here when it is ready, e.g.
// "https://monash.az1.qualtrics.com/jfe/form/SV_xxxxxxxxxxxx".
// The register-interest form is then replaced by the Qualtrics form.
var QUALTRICS_URL = "";

(function () {
  // ---------- podcast ----------
  var EPS = window.EPISODES || [];
  var list = document.getElementById("eps");
  var player = document.getElementById("player");
  if (list && player && EPS.length) {
    var current = 0;
    var meta = document.getElementById("epMeta"), title = document.getElementById("epTitle"),
        desc = document.getElementById("epDesc"), link = document.getElementById("epLink");

    list.innerHTML = EPS.map(function (e, i) {
      var thumb = e.yt ? "https://i.ytimg.com/vi/" + e.yt + "/hqdefault.jpg" : "/whyalla/assets/brand/voices-from-whyalla-title-800.jpg";
      return '<li><button class="ep" type="button" data-i="' + i + '"' + (e.soon ? " disabled" : "") + '>' +
        '<span class="th"><img src="' + thumb + '" alt="" loading="lazy"></span>' +
        '<span><span class="lbl">Ep ' + e.n + (e.soon ? " · Coming soon" : " · Watch") + '</span><span class="ep-t">' + e.t + '</span></span></button></li>';
    }).join("");

    function select(i) {
      current = i;
      var e = EPS[i];
      list.querySelectorAll(".ep").forEach(function (b) { b.setAttribute("aria-current", +b.dataset.i === i ? "true" : "false"); });
      meta.textContent = "Episode " + e.n + (e.soon ? " · Coming soon" : "");
      title.textContent = e.t;
      desc.textContent = e.d || "";
      if (e.yt) link.href = "https://youtu.be/" + e.yt;
      var frame = player.querySelector("iframe");
      if (frame) frame.remove();
      player.classList.remove("on");
      player.classList.toggle("soon", !!e.soon);
      player.setAttribute("aria-label", e.soon ? e.t + " (coming soon)" : "Play " + e.t);
    }

    list.addEventListener("click", function (ev) {
      var b = ev.target.closest(".ep");
      if (b && !b.disabled) select(+b.dataset.i);
    });

    player.addEventListener("click", function () {
      var e = EPS[current];
      if (e.soon || !e.yt || player.classList.contains("on")) return;
      var f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + e.yt + "?autoplay=1&rel=0";
      f.title = "Voices from Whyalla, " + e.t;
      f.allow = "autoplay; encrypted-media; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      player.appendChild(f);
      player.classList.add("on");
    });

    select(0);
  }

  // ---------- register interest ----------
  var form = document.getElementById("eoi");
  if (!form) return;

  if (QUALTRICS_URL) {
    form.innerHTML = '<h3 class="prompt">Register your interest</h3>' +
      '<iframe src="' + QUALTRICS_URL + '" title="Register your interest"></iframe>';
    return;
  }

  var el = form.elements, status = document.getElementById("eoiStatus"), to = form.getAttribute("data-email");
  function say(msg, bad) { status.textContent = msg; status.classList.toggle("bad", !!bad); }

  form.addEventListener("submit", function (ev) {
    ev.preventDefault();
    var name = el.name.value.trim(), contact = el.contact.value.trim();
    if (!name || !contact) {
      say("Please add your name and an email or phone number.", true);
      (name ? el.contact : el.name).focus();
      return;
    }
    var body = "Name: " + name + "\nEmail or phone: " + contact + "\nI'd like to: " + el.way.value +
      (el.message.value.trim() ? "\n\n" + el.message.value.trim() : "") + "\n";
    location.href = "mailto:" + to + "?subject=" + encodeURIComponent("Whyalla Futures: register interest, " + name) +
      "&body=" + encodeURIComponent(body);
    say("Your email app should open with your details filled in. Press send there to finish. If nothing opens, email " + to + ".");
  });
})();
