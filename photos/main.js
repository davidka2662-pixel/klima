(function() {
  // --- MOBIL MENÜ KEZELÉS ---
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  
  if (navToggle && navLinks) {
    // Menü nyitása / zárása kattintásra
    navToggle.addEventListener('click', function() {
      navLinks.classList.toggle('is-open');
    });

    // Menü automatikus zárása görgetéskor
    window.addEventListener('scroll', function() {
      if (navLinks.classList.contains('is-open')) {
        navLinks.classList.remove('is-open');
      }
    }, { passive: true });
  }

  // --- FINOM BEÚSZÓ ANIMÁCIÓK SCROLLRA ---
  var els = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(function(el) { obs.observe(el); });
  } else {
    els.forEach(function(el) { el.classList.add('is-visible'); });
  }

  // --- IRÁNYÉRZÉKENY (DIRECTION-AWARE) STICKY LOGIKA ---
  var container = document.getElementById("smart-sticky-container");
  var card = document.getElementById("smart-sticky-card");

  if (container && card) {
    container.style.position = "relative";
    container.style.height = "100%";
    
    card.style.position = "absolute";
    card.style.width = "100%";
    // FONTOS: Töröltük a CSS transitiont! A mozgás azonnali lesz, a smoothságot a requestAnimationFrame adja
    card.style.willChange = "transform"; 

    var lastScrollY = window.scrollY;
    var currentOffset = 0; 
    var headerHeight = 90;
    
    // Állapotváltozó, hogy ne indítsunk feleslegesen új képkocka-frissítést
    var ticking = false;

    function updateCardPosition() {
      var scrollY = window.scrollY;
      var scrollDelta = scrollY - lastScrollY;
      
      var containerRect = container.getBoundingClientRect();
      var cardHeight = card.offsetHeight;
      var windowHeight = window.innerHeight;

      var maxOffset = Math.max(0, containerRect.height - cardHeight);

      if (scrollDelta > 0) {
        // LEFELÉ
        var distanceToBottom = (containerRect.top + currentOffset + cardHeight) - windowHeight;
        if (distanceToBottom < -20) {
          currentOffset += scrollDelta;
        }
      } else if (scrollDelta < 0) {
        // FELFELÉ
        var distanceToTop = containerRect.top + currentOffset;
        if (distanceToTop > headerHeight) {
          currentOffset += scrollDelta;
        }
      }

      // Korlátok
      currentOffset = Math.max(0, Math.min(currentOffset, maxOffset));

      // Mozgás alkalmazása
      card.style.transform = "translate3d(0, " + currentOffset + "px, 0)"; 
      
      lastScrollY = scrollY;
      
      // Jelezzük, hogy lefutott a frissítés, jöhet a következő scroll esemény
      ticking = false;
    }

    window.addEventListener("scroll", function() {
      // Csak akkor kérünk új képkockát, ha az előző már lefutott
      if (!ticking) {
        window.requestAnimationFrame(updateCardPosition);
        ticking = true;
      }
    }, { passive: true }); 
  }
})();
